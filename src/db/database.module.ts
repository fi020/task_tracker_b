import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is loaded
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const uri = isProduction
          ? configService.get<string>('MONGODB_URI_PROD') // Remote MongoDB URI
          : configService.get<string>('MONGODB_URI_DEV'); // Local MongoDB URI
        
          console.log(`Connecting to ${isProduction ? 'Production' : 'Local'}`);
          //         (`Connecting to ${isProduction ? 'Production' : 'Local'} MongoDB at: ${uri}`);
          // cna not log the uri as it contains password 

  
        return {
          uri,
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true,
// The warnings you're seeing indicate that the useNewUrlParser and useUnifiedTopology options are no longer needed or effective when using MongoDB Node.js Driver version 4.0 or later. These options were previously necessary for connection configuration but have since been deprecated.
        };
      },
    }),
  ],
})
export class DatabaseModule {}
