import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private repo: Repository<Lesson>,
    private coursesService: CoursesService,
  ) {}

  findByCourse(courseId: string) {
    return this.repo.find({ where: { courseId }, order: { order: 'ASC' } });
  }

  async findOne(id: string) {
    const lesson = await this.repo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  private async assertCanManage(courseId: string, userId: string, role: string) {
    const course = await this.coursesService.findOne(courseId);
    if (course.instructorId !== userId && role !== 'admin') throw new ForbiddenException();
  }

  async create(data: Partial<Lesson> & { courseId: string }, userId: string, role: string) {
    await this.assertCanManage(data.courseId, userId, role);
    const lesson = this.repo.create(data);
    return this.repo.save(lesson);
  }

  async update(id: string, data: Partial<Lesson>, userId: string, role: string) {
    const lesson = await this.findOne(id);
    await this.assertCanManage(lesson.courseId, userId, role);
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string, userId: string, role: string) {
    const lesson = await this.findOne(id);
    await this.assertCanManage(lesson.courseId, userId, role);
    return this.repo.delete(id);
  }
}
