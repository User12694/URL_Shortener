import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe()
  );  
  app.setGlobalPrefix('/');
  await app.listen(process.env.BACKEND_LOCALPORT ?? 3000);
  console.log(`Server is running on port ${process.env.BACKEND_LOCALPORT ?? 3000}`);
}
bootstrap();
