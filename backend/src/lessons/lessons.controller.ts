import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Lessons')
@Controller('courses/:courseId/lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  findAll(@Param('courseId') courseId: string) {
    return this.lessonsService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Param('courseId') courseId: string, @Body() body: any, @Request() req) {
    return this.lessonsService.create({ ...body, courseId }, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.lessonsService.update(id, body, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.lessonsService.remove(id, req.user.userId, req.user.role);
  }
}
