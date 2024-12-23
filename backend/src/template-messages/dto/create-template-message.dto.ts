import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplateMessageDto {
  @ApiProperty({
    description: 'Template text for the message',
    example: 'Hello, {{name}}! Your order #{{orderId}} is ready.',
  })
  messageTextTemplate: string;

  @ApiProperty({
    description: 'ID of the user creating the template message',
    example: 'user_123',
  })
  userId: string;
}
