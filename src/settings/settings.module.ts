import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MailModule } from '../mail/mail.module'; // Adjust the path if necessary

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env variables
    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema }, // Make sure UserModel is imported here
    ]),
    MailModule, 
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
