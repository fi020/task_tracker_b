import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // private jwtService: JwtService, // Uncomment this if you use JWT for authentication
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

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  // Uncomment this if you want to use JWT for authentication
  // async login(user: User): Promise<string> {
  //   const payload = { username: user.username, sub: user._id };
  //   return this.jwtService.sign(payload);
  // }
}
