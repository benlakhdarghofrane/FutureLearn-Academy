import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(@InjectRepository(Enrollment) private repo: Repository<Enrollment>) {}

  async enroll(userId: string, courseId: string) {
    const exists = await this.repo.findOne({ where: { userId, courseId } });
    if (exists) throw new ConflictException('Already enrolled');
    const enrollment = this.repo.create({ userId, courseId });
    return this.repo.save(enrollment);
  }

  findByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      relations: ['course', 'course.instructor', 'course.lessons'],
    });
  }

  findByCourse(courseId: string) {
    return this.repo.find({ where: { courseId }, relations: ['user'] });
  }

  async updateProgress(userId: string, courseId: string, progressPercent: number) {
    const enrollment = await this.repo.findOne({ where: { userId, courseId } });
    if (!enrollment) return null;
    enrollment.progressPercent = progressPercent;
    if (progressPercent >= 100) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();
    }
    return this.repo.save(enrollment);
  }

  isEnrolled(userId: string, courseId: string) {
    return this.repo.findOne({ where: { userId, courseId } });
  }
}
