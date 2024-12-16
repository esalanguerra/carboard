import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TemplateMessagesModule } from './template-messages/template-messages.module';
import { MessagesModule } from './messages/messages.module';
import { MetricsModule } from './metrics/metrics.module';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, TemplateMessagesModule, MessagesModule, MetricsModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
