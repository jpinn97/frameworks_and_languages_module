import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
 });
          //Use Nest the validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip validated object of any properties that do not use any validation decorators
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    disableErrorMessages: false, // Set to true if you don't want to send detailed errors back to the client
  }));
  await app.listen(8000);
}
bootstrap();
