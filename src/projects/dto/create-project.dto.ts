import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid UUIDv4 format' })
  referringEmployeeId!: string;
}
