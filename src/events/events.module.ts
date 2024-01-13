import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { UsersModule } from '../users/users.module';
import { ProjectUsersModule } from '../project-users/project-users.module';
import { AuthModule } from '../users/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]),
    forwardRef(() => ProjectUsersModule),
    forwardRef(()=> UsersModule), AuthModule],
  controllers: [EventsController],
  providers: [EventsService], 
  exports: [EventsService],
})
export class EventsModule {}
 