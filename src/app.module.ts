// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { TaskModule } from './task/task.module';
import { SettingsModule } from './settings/settings.module';
// import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make environment variables available globally
    }),
    DatabaseModule,
    UserModule,
    TaskModule,
    SettingsModule,
    // MailModule

    // Add other feature modules here
  ],
  controllers: [AppController], // added this so that i can test my backend local url
  providers: [AppService], // added this so that i can test my backend local url
})
export class AppModule {}
