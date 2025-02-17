import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './users/auth/auth.guard';
import { AuthModule } from './users/auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ProjectUsersModule } from './project-users/project-users.module';
import { ProjectUser } from './project-users/entities/project-user.entity';
import { Project } from './projects/entities/project.entity';
import { EventsModule } from './events/events.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User,ProjectUser,Project,Event],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    ProjectUsersModule,
    EventsModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
