import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find({ select: ['id', 'fullName', 'email', 'role', 'avatar', 'xp', 'rank', 'createdAt'] });
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
      .getCount();

    return { totalStudents };
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
