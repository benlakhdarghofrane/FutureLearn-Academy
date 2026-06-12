import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(@InjectRepository(Lesson) private repo: Repository<Lesson>) {}

  findByCourse(courseId: string) {
    return this.repo.find({ where: { courseId }, order: { order: 'ASC' } });
  }

  async findOne(id: string) {
    const lesson = await this.repo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  create(data: Partial<Lesson>) {
    const lesson = this.repo.create(data);
    return this.repo.save(lesson);
  }

  async update(id: string, data: Partial<Lesson>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
