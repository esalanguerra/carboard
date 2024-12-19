import { MESSAGE_STATUS } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({ description: "Text of the message", example: "Hello, world!" })
  message_text: string;

  @ApiProperty({ description: "WhatsApp number", example: "+1234567890" })
  whatsapp_number: string;

  @ApiPropertyOptional({
    description: "Status of the message",
    enum: MESSAGE_STATUS,
    example: MESSAGE_STATUS.PENDING,
  })
  status?: MESSAGE_STATUS;

  @ApiProperty({ description: "User ID associated with the message", example: "user_123" })
  user_id: string;

  @ApiPropertyOptional({ description: "Car ID associated with the message", example: "car_123" })
  car_id: string;
}
