import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.usersService.getStats(req.user.userId);
  }

  @Get('admin/overview')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminOverview() {
    return this.usersService.getAdminOverview();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  updateMe(@Request() req, @Body() body: any) {
    // Never trust the client for privileged fields — role/xp/rank/isActive are
    // managed by the platform (admin panel, progress engine), not self-editable.
    const { role, xp, rank, isActive, email, password, id, ...safeFields } = body ?? {};
    return this.usersService.update(req.user.userId, safeFields);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  updateAsAdmin(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
