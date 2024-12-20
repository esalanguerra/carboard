import { Module } from '@nestjs/common';
import { TemplateMessagesService } from './template-messages.service';
import { TemplateMessagesController } from './template-messages.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TemplateMessagesController],
  providers: [TemplateMessagesService, PrismaService],
})
export class TemplateMessagesModule {}
