import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Define allowed origins directly as a list
  const allowedOrigins: string[] = [
    // 'http://localhost:8084',
    // 'https://staging.your-domain.com',
    // 'https://your-domain.com'
    process.env.LOCAL_ORIGINS,
    process.env.VERCLE_FINAL_ORIGINS,
    process.env.RANDOM_ORIGINS,
    process.env.VERCLE_ORIGINS
  ];

  // Configure CORS options
  const corsOptions: CorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Include PATCH
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow cookies/auth headers
  };

  // Enable CORS with the chosen options
  app.enableCors(corsOptions);

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();
