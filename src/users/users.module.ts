import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';

import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
  controllers: [UserController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
