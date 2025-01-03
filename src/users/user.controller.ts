
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  private log(message: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    this.log("signup post");

    await this.usersService.signup(signupDto);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.log("login route");

    const token = await this.usersService.login(loginDto);
    return { token };
  }

  // Use the JwtAuthGuard to protect this route
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    // This will return the current user's details from the JWT payload
    return user; // You can select which fields to return (e.g., username, email)
  }
}
