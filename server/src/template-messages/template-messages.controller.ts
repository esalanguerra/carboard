import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TemplateMessagesService } from './template-messages.service';
import { CreateTemplateMessageDto } from './dto/create-template-message.dto';
import { UpdateTemplateMessageDto } from './dto/update-template-message.dto';

@Controller('template-messages')
export class TemplateMessagesController {
  constructor(private readonly templateMessagesService: TemplateMessagesService) {}

  @Post()
  create(@Body() createTemplateMessageDto: CreateTemplateMessageDto) {
    return this.templateMessagesService.create(createTemplateMessageDto);
  }

  @Get()
  findAll() {
    return this.templateMessagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateMessagesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTemplateMessageDto: UpdateTemplateMessageDto) {
    return this.templateMessagesService.update(id, updateTemplateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateMessagesService.remove(id);
  }
}
