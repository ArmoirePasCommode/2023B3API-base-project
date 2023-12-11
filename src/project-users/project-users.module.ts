import { Module } from '@nestjs/common';
import { ProjetUsersService } from './project-users.service';
import { ProjetUsersController } from './project-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/projet-user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser])],
  controllers: [ProjetUsersController],
  providers: [ProjetUsersService],
  exports: [ProjetUsersService]
})
export class ProjetUsersModule {}
