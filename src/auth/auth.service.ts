// // src/auth/auth.service.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { UsersService } from '../users/users.service';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(username: string, password: string): Promise<any> {
//     const user = await this.usersService.findByUsername(username);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return { userId: user.id, username: user.username };
//     }
//     throw new UnauthorizedException('Invalid credentials');
//   }

//   async login(user: any): Promise<{ access_token: string }> {
//     const payload = { username: user.username, sub: user.userId };
//     return { access_token: this.jwtService.sign(payload) };
//   }
// }
