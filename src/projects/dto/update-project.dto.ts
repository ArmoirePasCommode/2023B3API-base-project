import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsUUID, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  referringEmployeeId?: string;
}
