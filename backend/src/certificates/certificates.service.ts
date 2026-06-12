import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CertificatesService {
  constructor(@InjectRepository(Certificate) private repo: Repository<Certificate>) {}

  async issue(userId: string, courseId: string) {
    const exists = await this.repo.findOne({ where: { userId, courseId } });
    if (exists) return exists;
    const cert = this.repo.create({
      userId,
      courseId,
      certificateNumber: `FL-${uuidv4().substring(0, 8).toUpperCase()}`,
    });
    return this.repo.save(cert);
  }

  findByUser(userId: string) {
    return this.repo.find({ where: { userId }, relations: ['course'] });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['user', 'course'] });
  }
}
