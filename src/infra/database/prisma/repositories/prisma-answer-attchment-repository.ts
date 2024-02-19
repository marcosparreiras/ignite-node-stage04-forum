import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attchment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    await this.prisma.attachment.updateMany(
      PrismaAnswerAttachmentMapper.toPrismaCreateMany(attachments)
    );
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    await this.prisma.attachment.deleteMany(
      PrismaAnswerAttachmentMapper.toPrismaDeleteMany(attachments)
    );
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const data = await this.prisma.attachment.findMany({ where: { answerId } });
    return data.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { answerId } });
  }
}
