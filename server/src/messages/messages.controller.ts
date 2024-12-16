import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MESSAGE_STATUS } from '@prisma/client';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Get('count')
  countByFilters(
    @Query('customerId') customerId: string,
    @Query('status') status: MESSAGE_STATUS,
    @Query('date') date: string,
    @Query('whatsapp') whatsapp_phone: string,
  ) {
    return this.messagesService.countByFilters();
  }

  @Get('count/:customerId?')
  count(
    @Param('customerId') customerId: string,
    @Query('status') status: MESSAGE_STATUS,
    @Query('date') date: string,
    @Query('whatsappNumber') whatsapp_phone: string,) {
    return this.messagesService.count(customerId, status, date, whatsapp_phone);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
