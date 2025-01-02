import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { UserService } from 'src/users/user.service';
import { UserModule } from 'src/users/user.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env variables

    MongooseModule.forFeature([
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema }, // Make sure UserModel is imported here
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
