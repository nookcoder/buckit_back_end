import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { CommonModule } from './common/common.module';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { Project } from './project/entities/project.entity';
import { Like } from './like/entities/like.entity';
import { FundingModule } from './funding/funding.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/role.guard';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';
import { Category } from './project/entities/category.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulingModule } from './task-scheduling/task-scheduling.module';
import { PaymentModule } from './payment/payment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './notification/notification.module';
import { NotificationDetail } from './notification/entity/notification-detail.entity';
import { Notification } from './notification/entity/notification.entity';
import { Orders } from './funding/entities/order.entity';
import { Payment } from './payment/entities/payment.entity';
import { Share } from './funding/entities/share.entity';
import { Dividend } from './funding/entities/dividend.entity';
import { Account } from './user/entities/account.entity';
import { AccountHistory } from './user/entities/account-history.entity';
import { FinancialStatement } from './project/entities/financial-statements.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        ACCESS_SECRET_KEY: Joi.string().required(),
        ACCESS_EXPIRES_IN: Joi.string().required(),
        REFRESH_SECRET_KEY: Joi.string().required(),
        REFRESH_EXPIRES_IN: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        IMP_REST_API_KEY: Joi.string().required(),
        IMP_REST_SECRET_KEY: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Project,
        Like,
        Category,
        Notification,
        NotificationDetail,
        Orders,
        Share,
        Dividend,
        Account,
        AccountHistory,
      ],
      synchronize: true,
      useUTC: true,
      autoLoadEntities: true,
    }),
    // todo : Task Schedule 은 나중에 업뎃
    ScheduleModule.forRoot(),
    UsersModule,
    CommonModule,
    ProjectModule,
    LikeModule,
    AuthModule,
    FundingModule,
    TaskSchedulingModule,
    PaymentModule,
    NotificationModule,
    FinancialStatement,
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
