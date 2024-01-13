import {  IsEnum, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  date: Date;
  @IsEnum(['Accepted','Declined','Pending'])
  @IsOptional()
  eventStatus?: 'Accepted'| 'Declined'|'Pending' = 'Pending';
  @IsEnum(['RemoteWork', 'PaidLeave'])
  eventType: 'RemoteWork' | 'PaidLeave';
  @IsString()
  @IsOptional()
  eventDescription?: string;
  userId: string;
}
