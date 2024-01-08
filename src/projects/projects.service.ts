import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private readonly jwtService: JwtService,
  ) {}

  // Crée un nouveau projet
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsRepository.save(this.projectsRepository.create(createProjectDto));;
  }

  // Récupère un projet par son nom
  async getProject(name: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { name: name },
    });
    return project;
  }

  // Récupère tous les projets avec les employés associés
  async findAll(): Promise<Project[]> {
    const touslesprojets = await this.projectsRepository.find({
      relations: {
        referringEmployee: true
      },
    });
    return touslesprojets;
  }

  // Recherche un projet par l'ID de l'employé associé
  async findByEmployee(id: string): Promise<Project> {
    const options: FindManyOptions<Project> = {
      where: { referringEmployeeId: id },
      relations: ['user', 'project_user'],
    };
    const project = await this.projectsRepository.findOne(options);
    delete project.referringEmployee.password;
    return project;
  }

  // Recherche un projet par son ID
  async findById(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({where: { id: id }});
    return project;
  }
}
