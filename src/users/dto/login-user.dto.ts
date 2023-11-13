//login-user.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  
  username!: string;

  @IsNotEmpty() 

  password!: string;

}