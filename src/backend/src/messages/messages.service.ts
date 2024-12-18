import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGE_STATUS } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return await this.prismaService.sendMessages.create({
      data: createMessageDto,
    });
  }

  async findAll() {
    return await this.prismaService.sendMessages.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.sendMessages.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    return await this.prismaService.sendMessages.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.sendMessages.delete({
      where: { id },
    });
  }

  async count(user_id: string, status?: MESSAGE_STATUS, date?: string, whatsapp_phone?: string) {
    return await this.prismaService.sendMessages.count({
      where: {
        user_id: user_id,
        status: status,
        whatsapp_number: '+' + whatsapp_phone,
        createdAt: new Date(date),
      }
    })
  }
}
