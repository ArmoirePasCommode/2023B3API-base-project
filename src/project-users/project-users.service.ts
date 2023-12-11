import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    public readonly projectUserRepository: Repository<ProjectUser>,
  ) { }
  async create(createProjectUserDto: CreateProjectUserDto) {
    const newUser = this.projectUserRepository.create({...createProjectUserDto});
    const inserteddata = await this.projectUserRepository.save(newUser);
    return inserteddata;
  }
  async findByIdForRole(): Promise<ProjectUser[]> {
    return ;
  }

  findOne(id: number) {
    return `This action returns a #${id} projetUser`;
  }

}
