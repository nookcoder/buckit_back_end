import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { Project } from './project/entities/project.entity';
import { Like } from './like/entities/like.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Project, Like, Order],
      synchronize: true,
    }),
    UserModule,
    CommonModule,
    ProjectModule,
    LikeModule,
    AuthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
