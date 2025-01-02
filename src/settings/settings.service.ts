import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { UserService } from 'src/users/user.service';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,
    @InjectModel(User.name) private readonly userModel: Model<User>, // Inject User model
    private readonly mailerService: MailerService,
  ) {}

  private otps = new Map<string, string>(); // Temporary in-memory store (use Redis in production)

  async addOrUpdateEmail(userId: string, email: string): Promise<Setting> {
    const setting = await this.settingModel.findOneAndUpdate(
      { userId },
      { email, emailVerified: false },
      { new: true, upsert: true },
    );

    await this.sendOtp(email, userId);
    return setting;
  }

  async sendOtp(email: string, userId: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    this.otps.set(userId, otp);

    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

  const setting = await this.settingModel.findOneAndUpdate(
    { userId },
    { email, otp, otpExpiresAt, emailVerified: false },
    { new: true, upsert: true },
  );

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      text: `Your OTP is: ${otp}`,
    });


    console.log(`OTP sent to ${email}: ${otp}`); // Debugging only
  }

  async verifyEmail(userId: string, otp: string): Promise<void> {
    const setting = await this.settingModel.findOne({ userId });
  
    if (!setting) {
      throw new NotFoundException('Settings not found for user.');
    }
  
    if (!setting.otp || !setting.otpExpiresAt) {
      throw new BadRequestException('No OTP request found.');
    }
  
    if (setting.otp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }
  
    if (new Date() > setting.otpExpiresAt) {
      throw new BadRequestException('OTP has expired.');
    }
  
    // Mark email as verified
    setting.emailVerified = true;
    setting.otp = null; // Clear the OTP after successful verification
    setting.otpExpiresAt = null;
    await setting.save();
  }

  async getUserSettings(userId: string): Promise<Setting> {
    const settings = await this.settingModel.findOne({ userId });
    if (!settings) {
      return null;
    }
    return settings;
  }
  
  private generateRandomPassword(): string {
    // Generate a random password (length of 8-12 characters)
    return crypto.randomBytes(8).toString('hex');
  }

  async forgotPassword(email: string): Promise<string> {
    // Step 1: Check if the email exists in the settings database
    const setting = await this.settingModel.findOne({ email });
    if (!setting) {
      throw new NotFoundException('Email not found in our records.');
    }

    
    // Step 3: Update the user's password in the users database
    const user = await this.userModel.findById(setting.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Step 2: Generate a new random password
    const newPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password (You should hash the password in a real-world app)
    user.password = hashedPassword; // In a real application, hash the password before saving it.
    await user.save();

    // Step 4: Send the new password to the user's email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your New Password',
      text: `Your new password is: ${newPassword}`,
    });

    // Return a success message
    return 'A new password has been sent to your email.';
  }
  

}