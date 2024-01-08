import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsUUID, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  referringEmployeeId?: string;
}
