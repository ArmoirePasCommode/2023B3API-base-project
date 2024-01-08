import { Module, forwardRef } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { ProjectUsersController } from './project-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../users/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser]), forwardRef(() => ProjectsModule),
  forwardRef(() => UsersModule), AuthModule],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService]
})
export class ProjectUsersModule {}
