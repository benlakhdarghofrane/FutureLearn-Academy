import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('lesson/:lessonId/complete')
  markComplete(
    @Param('lessonId') lessonId: string,
    @Body('watchedSeconds') watchedSeconds: number,
    @Request() req,
  ) {
    return this.progressService.markComplete(req.user.userId, lessonId, watchedSeconds);
  }

  @Get('my')
  getMyProgress(@Request() req) {
    return this.progressService.findByUser(req.user.userId);
  }

  @Get('velocity')
  getLearningVelocity(@Request() req) {
    return this.progressService.getLearningVelocity(req.user.userId);
  }
}
