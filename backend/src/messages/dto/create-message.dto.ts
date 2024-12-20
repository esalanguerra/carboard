import { MESSAGE_STATUS } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'Text of the message', example: 'Hello, world!' })
  messageText: string;

  @ApiProperty({ description: 'WhatsApp number', example: '+1234567890' })
  whatsappNumber: string;

  @ApiPropertyOptional({
    description: 'Status of the message',
    enum: MESSAGE_STATUS,
    example: MESSAGE_STATUS.PENDING,
  })
  status?: MESSAGE_STATUS;

  @ApiProperty({
    description: 'User ID associated with the message',
    example: 'user_123',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Car ID associated with the message',
    example: 'car_123',
  })
  carId: string;

  @ApiPropertyOptional({
    description: 'Template message ID associated with the message',
    example: 'template_123',
  })
  templateMessageId: string;

  @ApiPropertyOptional({
    description: 'Schedule ID associated with the message',
    example: 'schedule_123',
  })
  scheduleId: string;
}
