import { PartialType } from '@nestjs/swagger';
import { CreateProjectUserDto } from './create-project-user.dto';
import { IsOptional, IsUUID, IsDateString } from 'class-validator';
export class UpdateProjectUserDto {
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  userId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  projectId?: string;
}

