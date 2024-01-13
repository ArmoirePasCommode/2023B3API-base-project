import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, LessThanOrEqual, FindOneOptions, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    public readonly projectUserRepository: Repository<ProjectUser>,
  ) { }
  async create(
    createProjectUserDto: CreateProjectUserDto,
  ): Promise<ProjectUser> {
    try {
      const newProjectUser = this.projectUserRepository.create(createProjectUserDto);
      const savedProjectUser = await this.projectUserRepository.save(newProjectUser);
  
      if (savedProjectUser == null) {
        throw new NotFoundException("User or project not found");
      }
  
      const options: FindManyOptions<ProjectUser> = {
        where: { id: savedProjectUser.id },
        relations: ['user', 'project', 'project.referringEmployee'],
      };
  
      const completeProjectUser = await this.projectUserRepository.findOne(options);
      delete completeProjectUser.project.referringEmployee.password;
      delete completeProjectUser.user.password;
  
      return completeProjectUser;
    } catch (error) {
      throw new NotFoundException("User or project not found");
    }
  }
  
  async getProjectUser(userId: string) {
    const options: FindOneOptions<CreateProjectUserDto> = {
      where: { userId: userId },
      relations: ['user', 'project', 'project.referringEmployee'],
    };
    const projectUser = await this.projectUserRepository.find(options);
    const rep = projectUser.map((projectUser) => ({
      id: projectUser.project.id,
      name: projectUser.project.name,
      referringEmployeeId: projectUser.project.referringEmployeeId,
      referringEmployee: {
        id: projectUser.user.id ,
        username: projectUser.user.username,
        email: projectUser.user.email,
        role: projectUser.user.role,
      },
    }));
    return rep;
  }

  async getUserInfo(id: string): Promise<ProjectUser[] | null> {
    const projectUsers = await this.projectUserRepository.find({
      ...this.findWithRelations(['user', 'project']), 
      where: { id }
    });    
    return projectUsers;
  }

  async findAllForRole(): Promise<ProjectUser[]> {
    return this.projectUserRepository.find(this.findWithRelations(['user', 'project']));
  }

  async checkForProjectConflict(createProjectUserDto: CreateProjectUserDto): Promise<ProjectUser | null> {
    const existingProjectUsers = await this.projectUserRepository.find({ 
      where: { userId: createProjectUserDto.userId } 
    });
    for (const existingProjectUser of existingProjectUsers) {
      if (this.hasConflict(existingProjectUser, createProjectUserDto)) {
        return existingProjectUser;
      }
    }
  }
  
  private hasConflict(existingProjectUser: ProjectUser, newProjectUserDto: CreateProjectUserDto): boolean {
    return (
      (existingProjectUser.startDate <= newProjectUserDto.startDate && existingProjectUser.endDate >= newProjectUserDto.startDate) ||
      (newProjectUserDto.startDate <= existingProjectUser.startDate && newProjectUserDto.endDate >= existingProjectUser.startDate)
    );
  }
  

  async findOne(id: string): Promise<ProjectUser> {
    const user = await this.projectUserRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException("Not Found");
    }
    return user;
  }

  async findId(idproject: string): Promise<string[]> {
    const projectUsers = await this.projectUserRepository.find({
      where: { projectId: idproject },
      select: ['id'],
    });
  
    return projectUsers.map((projectUser) => projectUser.id);
  }
  
  // Vérifier si l'utilisateur est impliqué dans un projet
  async isUserInvolvedInProject(userId: string, projectId: string): Promise<boolean> {
    const project = await this.projectUserRepository.findOne({
      where: { userId, projectId }
    });
    return !!project;
  }
  // Vérifie si un manager est associé à un projet à une date donnée
  async managerDate(userId: string, date: Date): Promise<ProjectUser> {
    const manager = await this.projectUserRepository.findOne({
      where: {
        startDate: LessThanOrEqual(date),
        endDate: MoreThanOrEqual(date),
        project: { referringEmployeeId: userId }},
      relations: ['project']
    });
    return manager;
  }
  
  private findWithRelations(relations: string[]): FindManyOptions<ProjectUser> {
    return { relations };
  }

}
