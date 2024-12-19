import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MESSAGE_STATUS } from '@prisma/client';

@ApiTags('messages') // Categoria no Swagger
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Create a new message' })
  @ApiBody({ type: CreateMessageDto })
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @ApiOperation({ summary: 'Retrieve all messages' })
  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a single message by ID' })
  @ApiParam({ name: 'id', description: 'ID of the message', example: 'message_123' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @ApiOperation({ summary: 'Count messages based on filters' })
  @ApiParam({ name: 'user_id', required: false, description: 'User ID (optional)', example: 'user_123' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MESSAGE_STATUS,
    description: 'Filter by message status',
    example: MESSAGE_STATUS.SENT,
  })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Filter by date (YYYY-MM-DD)', example: '2024-01-01' })
  @ApiQuery({
    name: 'whatsappNumber',
    required: false,
    type: String,
    description: 'Filter by WhatsApp number',
    example: '+1234567890',
  })
  @Get('count/:user_id?')
  count(
    @Param('user_id') user_id?: string,
    @Query('status') status?: MESSAGE_STATUS,
    @Query('date') date?: string,
    @Query('whatsappNumber') whatsapp_phone?: string,
  ) {
    return this.messagesService.count(user_id, status, date, whatsapp_phone);
  }

  @ApiOperation({ summary: 'Update a message by ID' })
  @ApiParam({ name: 'id', description: 'ID of the message', example: 'message_123' })
  @ApiBody({ type: UpdateMessageDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({ name: 'id', description: 'ID of the message', example: 'message_123' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
