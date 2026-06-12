import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToMany, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Progress } from '../../progress/entities/progress.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ default: 0 })
  duration: number; // seconds

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  resources: string[];

  @Column({ default: false })
  isFree: boolean;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @OneToMany(() => Progress, (p) => p.lesson)
  progress: Progress[];

  @CreateDateColumn()
  createdAt: Date;
}
