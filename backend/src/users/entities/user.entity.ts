import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';
import { Course } from '../../courses/entities/course.entity';

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 'Onyx' })
  rank: string;

  @Column({ type: 'simple-array', nullable: true })
  techStack: string[];

  @Column({ nullable: true })
  publicProfileUrl: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];

  @OneToMany(() => Enrollment, (e) => e.user)
  enrollments: Enrollment[];

  @OneToMany(() => Progress, (p) => p.user)
  progress: Progress[];

  @OneToMany(() => Certificate, (c) => c.user)
  certificates: Certificate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
