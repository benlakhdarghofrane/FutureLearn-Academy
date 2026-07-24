import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from './entities/site-setting.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSetting) private repo: Repository<SiteSetting>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Course) private coursesRepo: Repository<Course>,
    @InjectRepository(Enrollment) private enrollmentsRepo: Repository<Enrollment>,
  ) {}

  private async getOrCreate(): Promise<SiteSetting> {
    let settings = await this.repo.findOne({ where: { id: 1 } });
    if (!settings) {
      settings = this.repo.create({ id: 1 });
      settings = await this.repo.save(settings);
    }
    return settings;
  }

  // Live counts pulled directly from the database — never hardcoded.
  private async getLiveStats() {
    const [totalStudents, totalInstructors, totalCourses, totalEnrollments] = await Promise.all([
      this.usersRepo.count({ where: { role: UserRole.STUDENT } }),
      this.usersRepo.count({ where: { role: UserRole.INSTRUCTOR } }),
      this.coursesRepo.count({ where: { isPublished: true } }),
      this.enrollmentsRepo.count(),
    ]);
    return { totalStudents, totalInstructors, totalCourses, totalEnrollments };
  }

  async getPublicSettings() {
    const settings = await this.getOrCreate();
    const stats = await this.getLiveStats();
    return { ...settings, stats };
  }

  async update(data: Partial<SiteSetting>) {
    const settings = await this.getOrCreate();
    Object.assign(settings, data);
    await this.repo.save(settings);
    return this.getPublicSettings();
  }
}
