import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService, // Uncomment this if you use JWT for authentication
  ) { }

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, password } = signupDto;

    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    await user.save();
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials > user not found');
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials > pasword not match');
    }

    const payload = { username: user.username, id: user.id };  // Use the correct identifier field for your model
    console.log(payload);

    return this.createJwtToken(payload);
  }

  private createJwtToken(payload: any): string {
    const secret = process.env.JWT_SECRET; // Retrieve the secret

    return this.jwtService.sign(payload, {
      secret, // Use the secret
      expiresIn: '1h', // Set token expiration
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Update the user's password (you should hash the password in a real-world app)
    user.password = newPassword; // You might want to hash this password before saving
    await user.save();
    return user;
  }


}
