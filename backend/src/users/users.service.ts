import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Certificate } from '../certificates/entities/certificate.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Course) private coursesRepo: Repository<Course>,
    @InjectRepository(Enrollment) private enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Certificate) private certificatesRepo: Repository<Certificate>,
  ) {}

  findAll() {
    return this.repo.find({
      select: ['id', 'fullName', 'email', 'role', 'avatar', 'xp', 'rank', 'isActive', 'createdAt'],
      order: { createdAt: 'DESC' },
    });
  }

  // Real, DB-derived platform overview for the admin dashboard/analytics — no hardcoded numbers.
  async getAdminOverview() {
    const [totalUsers, totalStudents, totalInstructors, totalAdmins] = await Promise.all([
      this.repo.count(),
      this.repo.count({ where: { role: UserRole.STUDENT } }),
      this.repo.count({ where: { role: UserRole.INSTRUCTOR } }),
      this.repo.count({ where: { role: UserRole.ADMIN } }),
    ]);

    const [totalCourses, publishedCourses, draftCourses] = await Promise.all([
      this.coursesRepo.count(),
      this.coursesRepo.count({ where: { isPublished: true } }),
      this.coursesRepo.count({ where: { isPublished: false } }),
    ]);

    const totalEnrollments = await this.enrollmentsRepo.count();
    const completedEnrollments = await this.enrollmentsRepo.count({ where: { isCompleted: true } });
    const totalCertificates = await this.certificatesRepo.count();

    const revenueRaw = await this.enrollmentsRepo.manager
      .createQueryBuilder(Enrollment, 'e')
      .leftJoin('e.course', 'c')
      .select('COALESCE(SUM(c.price), 0)', 'total')
      .getRawOne();

    const topCourses = await this.coursesRepo.manager
      .createQueryBuilder(Course, 'c')
      .leftJoin('c.enrollments', 'e')
      .leftJoin('c.instructor', 'i')
      .select('c.id', 'id')
      .addSelect('c.title', 'title')
      .addSelect('c.price', 'price')
      .addSelect('i.fullName', 'instructorName')
      .addSelect('COUNT(e.id)', 'studentCount')
      .groupBy('c.id')
      .addGroupBy('i.fullName')
      .orderBy('"studentCount"', 'DESC')
      .limit(5)
      .getRawMany();

    const recentUsers = await this.repo.find({
      select: ['id', 'fullName', 'email', 'role', 'createdAt'],
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalCourses,
      publishedCourses,
      draftCourses,
      totalEnrollments,
      completedEnrollments,
      totalCertificates,
      totalRevenue: Number(revenueRaw?.total ?? 0),
      topCourses: topCourses.map((c) => ({
        id: c.id,
        title: c.title,
        price: Number(c.price),
        instructorName: c.instructorName,
        studentCount: Number(c.studentCount),
      })),
      recentUsers,
    };
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['enrollments', 'enrollments.course', 'certificates'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: Partial<User>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async getStats(instructorId: string) {
    const totalStudents = await this.repo
      .createQueryBuilder('u')
      .innerJoin('u.enrollments', 'e')
      .innerJoin('e.course', 'c', 'c.instructorId = :instructorId', { instructorId })
      .distinct(true)
      .getCount();

    const activeCourses = await this.repo.manager
      .createQueryBuilder(Course, 'c')
      .where('c.instructorId = :instructorId', { instructorId })
      .getCount();

    const completionStats = await this.repo.manager
      .createQueryBuilder(Enrollment, 'e')
      .leftJoin('e.course', 'c', 'c.instructorId = :instructorId', { instructorId })
      .select('AVG(CASE WHEN e."isCompleted" = true THEN 100 ELSE 0 END)', 'averageCompletionRate')
      .getRawOne();

    return {
      totalStudents: Number(totalStudents ?? 0),
      activeCourses: Number(activeCourses ?? 0),
      averageCompletionRate: Number(completionStats?.averageCompletionRate ?? 0),
    };
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
