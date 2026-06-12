import { Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post(':courseId')
  enroll(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.enroll(req.user.userId, courseId);
  }

  @Get('my')
  getMy(@Request() req) {
    return this.enrollmentsService.findByUser(req.user.userId);
  }

  @Get('course/:courseId')
  getByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }
}
