import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
export class CreateProjectUserDto {
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate!: Date;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  userId!: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  projectId!: string;
}
