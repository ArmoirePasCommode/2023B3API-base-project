import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, In } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';


@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createEvent(userId: string, createEventDto: CreateEventDto): Promise<Event> {
    const event = await this.findEventByUserAndDate(userId, createEventDto.date);
    this.checkExistingEvent(event);
  
    if (createEventDto.eventType === 'RemoteWork') {
      this.checkRemoteWorkLimit(userId, createEventDto.date);
    }
  
    const eventStatus = createEventDto.eventType === 'RemoteWork' ? 'Accepted' : 'Pending';
    const newEvent = this.createAndSaveEvent({ ...createEventDto, userId, eventStatus });
  
    return newEvent;
  }
  
  private async findEventByUserAndDate(userId: string, date: Date): Promise<Event | undefined> {
    return await this.eventRepository.findOne({
      where: { userId, date },
      relations: ['user'],
    });
  }
  
  private checkExistingEvent(event: Event | undefined): void {
    if (event) {
      throw new UnauthorizedException('Déjà un événement créé ce jour.');
    }
  }
  
  private async checkRemoteWorkLimit(userId: string, date: Date): Promise<void> {
    const start = dayjs(date).startOf('week').subtract(1, 'day').toDate();
    const end = dayjs(start).add(6, 'day').toDate();
    const remoteWorkCount = await this.eventRepository.count({
      where: {
        userId,
        eventType: 'RemoteWork',
        date: Between(start, end),
      },
    });
  
    if (remoteWorkCount >= 2) {
      throw new UnauthorizedException('Déjà 2 jours de télétravail');
    }
  }
  
  private createAndSaveEvent(data: Partial<CreateEventDto> & { userId: string, eventStatus: string }): Promise<Event> {
    const event = this.eventRepository.create(data);
    return this.eventRepository.save(event);
  }
  

  async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  async getAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  } 
}
