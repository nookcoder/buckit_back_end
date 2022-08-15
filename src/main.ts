import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RolesGuard } from './auth/roles/role.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { initializeApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import applicationDefault = credential.applicationDefault;
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Buckit API Docs')
    .setDescription('Buckit v1 API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.useGlobalGuards(new RolesGuard(new JwtService(), new Reflector()));
  app.enableCors();
  initializeApp({
    credential: applicationDefault(),
  });
  await app.listen(3000);
}
bootstrap();
