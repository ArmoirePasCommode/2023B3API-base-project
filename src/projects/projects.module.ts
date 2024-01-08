import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectUsersModule } from '../project-users/project-users.module';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([Project]),
  forwardRef(() => ProjectUsersModule),
  forwardRef(() => UsersModule)],
  controllers: [ProjectsController],
  providers: [ProjectsService, JwtService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
