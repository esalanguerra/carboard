import { Injectable } from '@nestjs/common';
import { CreateTemplateMessageDto } from './dto/create-template-message.dto';
import { UpdateTemplateMessageDto } from './dto/update-template-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TemplateMessagesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTemplateMessageDto: CreateTemplateMessageDto) {
    return await this.prismaService.templateMessage.create({
      data: createTemplateMessageDto,
    });
  }

  async findAll() {
    return await this.prismaService.templateMessage.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.templateMessage.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTemplateMessageDto: UpdateTemplateMessageDto) {
    return await this.prismaService.templateMessage.update({
      where: { id },
      data: updateTemplateMessageDto,
    });
  }

  async remove(id: string) {
    return await this.prismaService.templateMessage.delete({
      where: { id },
    });
  }
}
