import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';
// import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

//   @Post('signup')
//   async signup(
//     @Body('username') username: string,
//     @Body('password') password: string,
//   ) {
//     await this.usersService.signup(username, password);
//     return { message: 'User registered successfully' };
//   }

@Post('signup')
async signup(@Body() signupDto: SignupDto) {
  await this.usersService.signup(signupDto); // Pass the whole DTO
  return { message: 'User registered successfully' };
}


  


//   @Post('login')
//   async login(
//     @Body('username') username: string,
//     @Body('password') password: string,
//   ) {
//     const user = await this.usersService.validateUser(username, password);
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const token = await this.usersService.login(user);
//     return { token };
//   }
@Post('login')
async login(@Body() loginDto: LoginDto) {
  const token = await this.usersService.login(loginDto);
  return { token };
}

}
