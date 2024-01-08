import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  UnauthorizedException,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { ProjectUsersService } from '../project-users/project-users.service';
import { Project } from './entities/project.entity';
import { UserRole } from '../users/entities/user.entity';
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly userService: UsersService,
    private readonly projectUserService: ProjectUsersService,
  ) {}
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req): Promise<Project|{
    id: string;
    name: string;
    referringEmployeeId: string;
    referringEmployee: {
        id: string;
        username: string;
        email: string;
        role: UserRole;
    };
}> {
    if (req.user.role !== 'Admin') {
      throw new UnauthorizedException();
    }
  
    const user = await this.userService.getUserInfo(createProjectDto.referringEmployeeId);
  
    const allowedRoles = ['Admin', 'ProjectManager'];
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedException();
    }
  
    const project = await this.projectService.create(createProjectDto);
  
    if (!project) {
      throw new UnauthorizedException();
    }
  
    const getProject = await this.projectService.getProject(createProjectDto.name);
  
    if (getProject === null) {
      throw new UnauthorizedException();
    }
  
    const result = {
      id: getProject.id,
      name: createProjectDto.name,
      referringEmployeeId: createProjectDto.referringEmployeeId,
      referringEmployee: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  
    return result;
  }
  

  @Get()
  async getProjects(@Req() req) :Promise<Project[] | {
    id: string; name: string; referringEmployeeId: string; referringEmployee: {
      id: string;
      username: string;
      email: string;
      role: UserRole;
    };
  }[]> {
    try {
      if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
        return await this.projectService.findAll();
      } else if (req.user.role === 'Employee') {
        const employeeProjects =
          await this.projectUserService.getProjectUser(req.user.sub);
        return employeeProjects;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    } catch {
      throw new NotFoundException('Resource not found');
    }
  }


  @Get(':id')
  async getOneProject(@Param('id') projectId: string, @Req() req): Promise<Project> {
    const oneProject = await this.projectService.findById(projectId);
    if (oneProject == undefined) {
      throw new NotFoundException('Resource not found');
    }

    if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
      return oneProject;
    }
    if (req.user.role === 'Employee') {
      const result = await this.projectUserService.isUserInvolvedInProject(
        req.user.sub,
        projectId,
      );
      if (result === true) {
        return oneProject;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    }
  }
}
