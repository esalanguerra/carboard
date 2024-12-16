import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TemplateMessagesModule } from './template-messages/template-messages.module';
import { MessagesModule } from './messages/messages.module';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, TemplateMessagesModule, MessagesModule, CustomersModule, CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
