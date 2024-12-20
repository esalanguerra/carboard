import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { TemplateMessagesService } from './template-messages.service';
import { CreateTemplateMessageDto } from './dto/create-template-message.dto';
import { UpdateTemplateMessageDto } from './dto/update-template-message.dto';

@ApiTags('template-messages')
@Controller('template-messages')
export class TemplateMessagesController {
  constructor(
    private readonly templateMessagesService: TemplateMessagesService,
  ) {}

  @ApiOperation({ summary: 'Create a new template message' })
  @ApiBody({ type: CreateTemplateMessageDto })
  @Post()
  create(@Body() createTemplateMessageDto: CreateTemplateMessageDto) {
    return this.templateMessagesService.create(createTemplateMessageDto);
  }

  @ApiOperation({ summary: 'Retrieve all template messages' })
  @Get()
  findAll() {
    return this.templateMessagesService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a specific template message by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the template message',
    example: 'template_123',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateMessagesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a specific template message by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the template message to update',
    example: 'template_123',
  })
  @ApiBody({ type: UpdateTemplateMessageDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateMessageDto: UpdateTemplateMessageDto,
  ) {
    return this.templateMessagesService.update(id, updateTemplateMessageDto);
  }

  @ApiOperation({ summary: 'Delete a specific template message by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the template message to delete',
    example: 'template_123',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateMessagesService.remove(id);
  }
}
