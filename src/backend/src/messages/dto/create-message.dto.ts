import { MESSAGE_STATUS } from "@prisma/client";

export class CreateMessageDto {
  message_text: string;
  whatsapp_number: string;
  status?: MESSAGE_STATUS;
  user_id: string;
}
