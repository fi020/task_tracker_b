import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
        secret: process.env.JWT_SECRET, // Replace with environment variable in production
        // secret: 'your-secret-key', // Replace with environment variable in production
        signOptions: { expiresIn: '1h' },
      }),
  ],
  controllers: [UserController],
  // providers: [UserService],
  providers: [UserService,JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
