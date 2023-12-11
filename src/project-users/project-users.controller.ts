import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';

@Controller('project-users')
export class ProjetUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  async createProjetUsers(@Body() createProjectUserDto: CreateProjectUserDto) {
    return this.projectUsersService.create(createProjectUserDto);
  }

  @Get()
  async findAllForRole(): Promise<ProjectUser[]> {
    return this.projectUsersService.findAllForRole();
  } 

}
