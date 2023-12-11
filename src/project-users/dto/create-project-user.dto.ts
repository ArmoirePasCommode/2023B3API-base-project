import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
export class CreateProjectUserDto {
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate!: Date;

  @IsNotEmpty()
  @IsUUID('4') 
  userId!: string;

  @IsNotEmpty()
  @IsUUID('4')
  projectId!: string;
}
