import { Controller, Get, Post, Body, ValidationPipe,
  UsePipes, Request, UnauthorizedException, ConflictException, UseGuards, ParseUUIDPipe, Param  } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUser } from './entities/project-user.entity';
import  {Request as ExpressRequest} from 'express';
import { User, UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '../users/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('/project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createProjetUsers(@Body() createProjectUserDto: CreateProjectUserDto, @Request() req: ExpressRequest): Promise<ProjectUser> {
    const __user = req.user as User;
     if (__user.role === UserRole.Employee){
      throw new UnauthorizedException();
     }
    
    const hasConflict = await this.projectUsersService.checkForProjectConflict(createProjectUserDto);
    if (hasConflict) {      
      throw new ConflictException();
    }

    return this.projectUsersService.create(createProjectUserDto);
  }

  @Get()
  async findAllForRole(@Request() req: ExpressRequest): Promise<ProjectUser[]> {
    const __user = req.user as User;
    if (__user.role === UserRole.Employee){
      return this.projectUsersService.getUserInfo(__user.id);
    }else{
      return this.projectUsersService.findAllForRole();
    }
  }

  @Get('/:id')
  async findProjectUserById(@Param('id', ParseUUIDPipe) idproject: string, @Request() req: ExpressRequest): Promise<ProjectUser> {
    const __user = req.user as User;
    let test = false
    if (__user.role === UserRole.Employee){
      const tab = await this.projectUsersService.findId(idproject)
      tab.forEach(element => {if (element === __user.id) test = true;
      });
      if( test )return this.projectUsersService.findOne(idproject);
      else throw new UnauthorizedException();
    } else {
      return this.projectUsersService.findOne(idproject);
    }
  }

}
