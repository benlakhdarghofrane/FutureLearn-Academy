import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private repo: Repository<Progress>,
    @InjectRepository(Lesson) private lessonsRepo: Repository<Lesson>,
    @InjectRepository(Enrollment) private enrollmentsRepo: Repository<Enrollment>,
    private certificatesService: CertificatesService,
  ) {}

  async markComplete(userId: string, lessonId: string, watchedSeconds = 0) {
    let progress = await this.repo.findOne({ where: { userId, lessonId } });
    if (progress) {
      progress.isCompleted = true;
      progress.watchedSeconds = watchedSeconds;
    } else {
      progress = this.repo.create({ userId, lessonId, isCompleted: true, watchedSeconds });
    }
    await this.repo.save(progress);

    // Recompute the real course-level progress for this student's enrollment.
    const lesson = await this.lessonsRepo.findOne({ where: { id: lessonId } });
    if (lesson) {
      const enrollment = await this.enrollmentsRepo.findOne({
        where: { userId, courseId: lesson.courseId },
      });
      if (enrollment) {
        const courseLessons = await this.lessonsRepo.find({ where: { courseId: lesson.courseId } });
        const completedProgress = await this.repo.find({
          where: { userId, isCompleted: true },
          relations: ['lesson'],
        });
        const completedInCourse = completedProgress.filter(
          (p) => p.lesson?.courseId === lesson.courseId,
        ).length;
        const total = courseLessons.length || 1;
        const percent = Math.min(100, Math.round((completedInCourse / total) * 100));
        enrollment.progressPercent = percent;
        if (percent >= 100 && !enrollment.isCompleted) {
          enrollment.isCompleted = true;
          enrollment.completedAt = new Date();
        }
        await this.enrollmentsRepo.save(enrollment);
        if (percent >= 100) {
          await this.certificatesService.issue(userId, lesson.courseId);
        }
      }
    }

    return progress;
  }

  findByUser(userId: string) {
    return this.repo.find({ where: { userId }, relations: ['lesson'] });
  }

  async getLearningVelocity(userId: string) {
    const last30days = new Date();
    last30days.setDate(last30days.getDate() - 30);
    return this.repo.createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .andWhere('p.completedAt >= :date', { date: last30days })
      .andWhere('p.isCompleted = true')
      .select("DATE_TRUNC('day', p.completedAt)", 'day')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE_TRUNC('day', p.completedAt)")
      .orderBy('day', 'ASC')
      .getRawMany();
  }
}
