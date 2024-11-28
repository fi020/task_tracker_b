import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/dto/signup.dto';
// import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class UserController {
  constructor(private authService: UserService) {}

//   @Post('signup')
//   async signup(
//     @Body('username') username: string,
//     @Body('password') password: string,
//   ) {
//     await this.authService.signup(username, password);
//     return { message: 'User registered successfully' };
//   }

@Post('signup')
async signup(@Body() signupDto: SignupDto) {
  await this.authService.signup(signupDto); // Pass the whole DTO
  return { message: 'User registered successfully' };
}


  

//   @Post('login')
//   async login(
//     @Body('username') username: string,
//     @Body('password') password: string,
//   ) {
//     const user = await this.authService.validateUser(username, password);
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const token = await this.authService.login(user);
//     return { token };
//   }
}
