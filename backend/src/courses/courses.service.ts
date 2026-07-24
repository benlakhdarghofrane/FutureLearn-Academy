import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private repo: Repository<Course>) {}

  findAll(query?: { search?: string; level?: string; tag?: string }) {
    const qb = this.repo.createQueryBuilder('c')
      .leftJoinAndSelect('c.instructor', 'i')
      .select(['c', 'i.id', 'i.fullName', 'i.avatar', 'i.title'])
      .where('c.isPublished = true');

    if (query?.search) {
      qb.andWhere('c.title ILIKE :search OR c.description ILIKE :search', {
        search: `%${query.search}%`,
      });
    }
    if (query?.level) qb.andWhere('c.level = :level', { level: query.level });
    if (query?.tag) qb.andWhere(':tag = ANY(c.tags)', { tag: query.tag });

    return qb.orderBy('c.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const course = await this.repo.findOne({
      where: { id },
      relations: ['instructor', 'lessons'],
      order: { lessons: { order: 'ASC' } },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  findByInstructor(instructorId: string) {
    return this.repo.find({
      where: { instructorId },
      relations: ['enrollments', 'enrollments.user', 'lessons'],
      order: { createdAt: 'DESC' },
    });
  }

  // Admin: every course on the platform, published or draft.
  findAllForAdmin() {
    return this.repo.find({
      relations: ['instructor', 'enrollments'],
      order: { createdAt: 'DESC' },
    });
  }

  create(dto: CreateCourseDto & { instructorId?: string }, requesterId: string, requesterRole: string) {
    const instructorId = requesterRole === 'admin' && dto.instructorId ? dto.instructorId : requesterId;
    const { instructorId: _ignored, ...rest } = dto as any;
    const course = this.repo.create({ ...rest, instructorId });
    return this.repo.save(course);
  }

  async update(id: string, data: Partial<Course>, userId: string, role: string) {
    const course = await this.findOne(id);
    if (course.instructorId !== userId && role !== 'admin') throw new ForbiddenException();
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string, userId: string, role: string) {
    const course = await this.findOne(id);
    if (course.instructorId !== userId && role !== 'admin') throw new ForbiddenException();
    return this.repo.delete(id);
  }
}
