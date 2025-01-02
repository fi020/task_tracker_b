import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting } from './schemas/setting.schema';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<Setting>,
    @InjectModel(User.name) private readonly userModel: Model<User>, // Inject User model
    private readonly mailerService: MailerService,
  ) { }

  private otps = new Map<string, string>(); // Temporary in-memory store (use Redis in production)

  async addOrUpdateEmail(userId: string, email: string): Promise<Setting> {
    // Step 1: Check if the email is already associated with another user
    const existingSetting = await this.settingModel.findOne({ email });
    if (existingSetting && existingSetting.userId !== userId) {
      throw new BadRequestException('Email is already associated with another user.');
    }

    // Step 2: Update the email for the current user or create a new setting
    const setting = await this.settingModel.findOneAndUpdate(
      { userId }, // Find by userId
      { email, emailVerified: false }, // Update email and reset emailVerified to false
      { new: true, upsert: true }, // Return the updated document, create if not found
    );

    // Step 3: Fetch the user and send OTP
    // const user = await this.userModel.findById(userId); // Use userId directly
    // if (!user) {
    //   throw new NotFoundException('User not found.');
    // }

    // const username = user.username;

    // await this.sendOtp(email, userId, username);

    return setting;
  }


  async sendOtp(email: string, userId: string, username: string): Promise<void> {
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
      text: `Your OTP for ${username} is: ${otp}`,
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
      // throw new NotFoundException('Email not found in our records.');
      throw new HttpException(
        { message: 'Email not found in our records. from backend' },
        HttpStatus.NOT_FOUND,
      );
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
      text: `Your new password ${user.username} is: ${newPassword}`,
    });

    // Return a success message
    return 'A new password has been sent to your email.';
  }


  async resendOtp(userId: string): Promise<string> {
    const setting = await this.settingModel.findOne({ userId });

    if (!setting || !setting.email) {
      throw new BadRequestException('No email found for this user.');
    }
    // await this.sendOtp(email, userId, username);

    // Generate and send a new OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    // this.otps.set(userId, otp);

    // const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration
    const user = await this.userModel.findById(userId); // Use userId directly
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const username = user.username;
    await this.sendOtp(setting.email, userId, "k");

    return 'OTP resent successfully';
  }
}