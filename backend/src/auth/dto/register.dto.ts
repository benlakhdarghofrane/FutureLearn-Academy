import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'Alex Mercer' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'alex@futurelearn.io' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  // Public registration can only ever create a student or instructor account.
  // Admin accounts are provisioned separately (seed script / promoted by another admin).
  @ApiProperty({ enum: [UserRole.STUDENT, UserRole.INSTRUCTOR], default: UserRole.STUDENT })
  @IsOptional()
  @IsIn([UserRole.STUDENT, UserRole.INSTRUCTOR])
  role?: UserRole;
}
