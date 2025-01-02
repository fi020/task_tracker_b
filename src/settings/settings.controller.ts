import { Controller, Post, Put, Body, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('email')
  
  async addOrUpdateEmail(@Req() req, @Body('email') email: string) {
    const userId = req.user.userId; // Extracted from JWT token
    console.log("here email post route");
    
    return this.settingsService.addOrUpdateEmail(userId, email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('email/verify')
  async verifyEmail(@Req() req, @Body('otp') otp: string) {
    const userId = req.user.userId;
    console.log("email varify post route");
    
    return this.settingsService.verifyEmail(userId, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Get('data')
  async getUserSettings(@Req() req) {
    const userId = req.user.userId; // Extracted from JWT token
    console.log('Get user settings route');
    return this.settingsService.getUserSettings(userId);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    console.log('Forgot password route');
    return this.settingsService.forgotPassword(email);
  }
}
