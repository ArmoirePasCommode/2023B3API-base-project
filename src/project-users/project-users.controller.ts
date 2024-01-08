import { Controller, Get, Post, Body, ValidationPipe,
  UsePipes, Request, HttpCode, HttpStatus, UnauthorizedException, ConflictException, UseGuards, ParseUUIDPipe, Param, NotFoundException  } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import  {Request as ExpressRequest} from 'express';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '../users/auth/auth.guard';

@Controller('/project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async createProjetUsers(@Body() createProjectUserDto: CreateProjectUserDto, @Request() req: ExpressRequest): Promise<ProjectUser> {
    const __user = req.user as User;
     if (__user.role === UserRole.Employee){
      throw new UnauthorizedException('Access Denied');
     }
    
    const hasConflict = await this.projectUsersService.checkForProjectConflict(createProjectUserDto);
    if (hasConflict) {      
      throw new ConflictException('Conflit avec les dates');
    }

    const project= await this.projectUsersService.create(createProjectUserDto);
    if (project !== null) {
      return project;
    } else {
      throw new NotFoundException();
    }
  }

  @Get()
  async findAllForRole(@Request() req: ExpressRequest): Promise<ProjectUser[]> {
    const __user = req.user as User;
    if (__user.role === UserRole.Employee){
      const projectuser= await this.projectUsersService.getUserInfo(__user.id);
      if (projectuser == null) {
        throw new UnauthorizedException('Not Found');
      }
      return projectuser;
    }else{
      const projectuser= await this.projectUsersService.findAllForRole();
      if (projectuser == null) {
        throw new NotFoundException();
    }
    return projectuser;
    }
  }

  @Get('/:id')
  async findProjectUserById(@Param('id', ParseUUIDPipe) idproject: string, @Request() req: ExpressRequest): Promise<ProjectUser> {
      const projectofuser = await this.projectUsersService.findOne(idproject);
      const requestuser= req.user as User
      if (projectofuser == null) {
        throw new UnauthorizedException('The project of the user was not found');
      }
      if (requestuser.role === UserRole.Employee ){
        if (projectofuser.userId === requestuser.id) {
          return projectofuser;
        }
      }else{
        return projectofuser;
      }  
  }

}
