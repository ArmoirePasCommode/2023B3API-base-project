import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
}
