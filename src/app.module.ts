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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make environment variables available globally
    }),
    DatabaseModule,
    // Add other feature modules here
  ],
})
export class AppModule {}
