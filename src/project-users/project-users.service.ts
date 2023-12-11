import { Injectable } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { log } from 'console';
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

  async getUserInfo(id: string): Promise<ProjectUser[] | null> {
    return this.projectUserRepository.find({ where: { userId: id } });
  }

  async findAllForRole(): Promise<ProjectUser[]> {
    return this.projectUserRepository.find();
  }
  async checkForProjectConflict(createProjectUserDto: CreateProjectUserDto): Promise<boolean> {
    const { userId, startDate, endDate } = createProjectUserDto;
    
   
    const conflictingAssignment = await this.projectUserRepository
      .createQueryBuilder('pu')
      .where('pu.userId = :userId', { userId })
      .andWhere('(pu.startDate < :endDate AND pu.endDate > :startDate)', { startDate, endDate })
      .getOne();
    return !!conflictingAssignment;
  }

  async findOne(id: string): Promise<ProjectUser> {
    return this.projectUserRepository.findOneBy({ id });
  }

  async findId(idproject: string): Promise<string[]> {
    const projectUsers = await this.projectUserRepository.find({
      where: { projectId: idproject },
      select: ['id'],
    });
  
    return projectUsers.map((projectUser) => projectUser.id);
  }
  
  

}
