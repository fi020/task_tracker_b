import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';
// import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
    constructor(private usersService: UserService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        console.log("signup post");
        
        await this.usersService.signup(signupDto); // Pass the whole DTO
        return { message: 'User registered successfully' };
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        console.log("login route");
        
        const token = await this.usersService.login(loginDto);
        return { token };
    }

}
