// // src/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { UsersModule } from '../users/users.module';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.register({
//       secret: 'your_jwt_secret', // Replace with environment variable
//       signOptions: { expiresIn: '1h' },
//     }),
//     UsersModule,
//   ],
//   providers: [AuthService],
//   controllers: [AuthController],
// })
// export class AuthModule {}
