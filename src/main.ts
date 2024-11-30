import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // await app.listen(process.env.PORT ?? 3000);
 // Enable CORS
//  app.enableCors({
//   origin: ['http://localhost:8084'], // Allow frontend URL
//   credentials: true, // Allow cookies or auth headers if needed
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // HTTP methods you want to allow
// });

 // Configure CORS
 const corsOptions: CorsOptions = {
  origin: 'http://localhost:8084', // Allow your frontend's domain
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Include PATCH here
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow required headers
};

app.enableCors(corsOptions);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
