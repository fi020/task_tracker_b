import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService, // Uncomment this if you use JWT for authentication
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, password } = signupDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new this.userModel({ username, password: hashedPassword });
    await user.save();
  }

//   async validateUser(username: string, password: string): Promise<User | null> {
//     const user = await this.userModel.findOne({ username });
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return user;
//     }
//     return null;
//   }


//   async login(user: User): Promise<string> {
//     const payload = { username: user.username, sub: user._id };
//     return this.jwtService.sign(payload);
//   }


// async validateUser(username: string, password: string): Promise<User | null> {
//     const user = await this.userModel.findOne(username);
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const passwordMatches = await bcrypt.compare(password, user.password);
//     if (!passwordMatches) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     return user;
//   }

  // Issue JWT token
  async login(loginDto: LoginDto): Promise<string> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({username});
    if (!user) {
        throw new UnauthorizedException('Invalid credentials > user not found');
      }
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException('Invalid credentials > pasword not match');
      }

    const payload = { username: user.username, sub: user.id };  // Use the correct identifier field for your model
    return this.createJwtToken(payload);
  }

  // Create JWT token
  private createJwtToken(payload: any): string {
    const secret = process.env.JWT_SECRET; // Retrieve the secret

    // Log the secret (only for debugging; avoid in production)
    // console.log(secret);

    return this.jwtService.sign(payload, {
        secret, // Use the secret
        expiresIn: '1h', // Set token expiration
    });
}

}
