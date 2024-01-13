import { Controller, Post, Body, ValidationPipe, UsePipes, Req, Get, Param, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { EventsService } from './events.service';
import { ProjectUsersService } from '../project-users/project-users.service';
import { CreateEventDto } from './dto/create-event.dto';


@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly projectUserService: ProjectUsersService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    const userId = req.user.sub;
    return this.eventService.createEvent(userId, createEventDto);
  }
  @Get(':id')
  getEvent(@Param('id') event: string) {
    return this.eventService.getEvent(event);
  }
  @Get()
  getAll() {
    return this.eventService.getAll();
  }
 
}
