import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MESSAGE_STATUS } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMessageDto: CreateMessageDto) {
    return await this.prismaService.message.create({
      data: createMessageDto,
    });
  }

  async findAll() {
    return await this.prismaService.message.findMany({
      include: { user: true, car: true },
    });
  }

  async findOne(id: string) {
    return await this.prismaService.message.findUnique({
      where: { id },
      include: { user: true, car: true },
    });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    return await this.prismaService.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.message.delete({
      where: { id },
    });
  }

  async count() {
    return await this.prismaService.message.count();
  }

  async countFilter(status?: MESSAGE_STATUS, userId?: string) {
    return await this.prismaService.message.count({
      where: {
        status: status,
        userId: userId,
      },
    });
  }

  async qrcode() {}
}
