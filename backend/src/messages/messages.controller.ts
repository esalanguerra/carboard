import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MESSAGE_STATUS } from '@prisma/client';

@ApiTags('messages')
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

  @ApiOperation({ summary: 'Count messages based on filters on status' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: MESSAGE_STATUS,
    description: 'Filter by message status',
    example: MESSAGE_STATUS.SENT,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
    example: 'user_123',
  })
  @Get('count/filter')
  countFilter(
    @Query('status') status?: MESSAGE_STATUS,
    @Query('userId') userId?: string,
  ) {
    return this.messagesService.countFilter(status, userId);
  }

  @ApiOperation({ summary: 'Retrieve a single message by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the message',
    example: 'message_123',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @ApiOperation({ summary: 'Count all messages' })
  @Get('count')
  async count() {
    return this.messagesService.count();
  }

  @ApiOperation({ summary: 'Update a message by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the message',
    example: 'message_123',
  })
  @ApiBody({ type: UpdateMessageDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the message',
    example: 'message_123',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
