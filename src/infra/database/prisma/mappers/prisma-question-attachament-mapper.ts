import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error("Invalid attchment type.");
    }
    return QuestionAttachment.create(
      {
        attatchmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaUpdateMany(
    questionAttachments: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = questionAttachments.map((attachment) =>
      attachment.attatchmentId.toString()
    );

    return {
      data: { questionId: questionAttachments[0].questionId.toString() },
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    };
  }

  static toPrismaDeleteMany(
    questionAttachments: QuestionAttachment[]
  ): Prisma.AttachmentDeleteManyArgs {
    const attachmentsIds = questionAttachments.map((attachment) =>
      attachment.attatchmentId.toString()
    );
    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    };
  }
}
