import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(@InjectRepository(Progress) private repo: Repository<Progress>) {}

  async markComplete(userId: string, lessonId: string, watchedSeconds = 0) {
    let progress = await this.repo.findOne({ where: { userId, lessonId } });
    if (progress) {
      progress.isCompleted = true;
      progress.watchedSeconds = watchedSeconds;
    } else {
      progress = this.repo.create({ userId, lessonId, isCompleted: true, watchedSeconds });
    }
    return this.repo.save(progress);
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
