import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("Invalid attchment type.");
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        attachmentId: new UniqueEntityId(raw.id),
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrismaCreateMany(
    attachments: AnswerAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString()
    );
    return {
      data: { answerId: attachments[0].answerId.toString() },
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    };
  }

  static toPrismaDeleteMany(
    attachments: AnswerAttachment[]
  ): Prisma.AttachmentDeleteManyArgs {
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString()
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
