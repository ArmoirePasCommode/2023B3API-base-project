import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
@Injectable()
export class ProjectUsersService {
  create(createProjectUserDto: CreateProjectUserDto) {
    return 'This action adds a new projetUser';
  }

  findAllForRole(): Promise<ProjectUser[]> {
    return ;
  }

  findOne(id: number) {
    return `This action returns a #${id} projetUser`;
  }

  update(id: number, updateProjectUserDto: UpdateProjectUserDto) {
    return `This action updates a #${id} projetUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} projetUser`;
  }
}
