import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuestionAttachment(
  overide: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId
) {
  return QuestionAttachment.create(
    {
      attatchmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...overide,
    },
    id
  );
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps>) {
    const questionAttachment = makeQuestionAttachment(data);
    await this.prisma.attachment.update({
      where: { id: questionAttachment.attatchmentId.toString() },
      data: { questionId: questionAttachment.questionId.toString() },
    });
    return questionAttachment;
  }
}
