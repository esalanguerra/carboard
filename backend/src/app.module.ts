import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { TemplateMessagesModule } from './template-messages/template-messages.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CarsModule,
    UsersModule,
    MessagesModule,
    TemplateMessagesModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
