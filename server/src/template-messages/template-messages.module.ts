import { Module } from '@nestjs/common';
import { TemplateMessagesService } from './template-messages.service';
import { TemplateMessagesController } from './template-messages.controller';

@Module({
  controllers: [TemplateMessagesController],
  providers: [TemplateMessagesService],
})
export class TemplateMessagesModule {}
