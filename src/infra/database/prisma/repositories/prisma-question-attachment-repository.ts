import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repostory";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachament-mapper";

@Injectable()
export class PrismaQuestionAttchmentRepository
  implements QuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    await this.prisma.attachment.updateMany(
      PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)
    );
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;
    await this.prisma.attachment.deleteMany(
      PrismaQuestionAttachmentMapper.toPrismaDeleteMany(attachments)
    );
  }

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const data = await this.prisma.attachment.findMany({
      where: { questionId },
    });
    return data.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({ where: { questionId } });
  }
}
