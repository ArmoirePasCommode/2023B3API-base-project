import { Controller, Get, Post, Body, ValidationPipe,
  UsePipes, Request } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import  {Request as ExpressRequest} from 'express';

@Controller('project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createProjetUsers(@Body() createProjectUserDto: CreateProjectUserDto, @Request() req: ExpressRequest): Promise<ProjectUser> {
    console.log(req.user);
    
    return this.projectUsersService.create(createProjectUserDto);
  }

  // @Get()
  // async findAllForRole(): Promise<ProjectUser[]> {
  //   return this.projectUsersService.findAllForRole();
  // }

  // @Get(:id)
  // async findByIdForRole(): Promise<ProjectUser[]> {
  //   return this.projectUsersService.findByIdForRole();
  // } 

}
