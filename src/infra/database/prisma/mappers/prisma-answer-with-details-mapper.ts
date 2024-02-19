import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerWithDetails } from "@/domain/forum/enterprise/entities/value-objects/answer-with-details";
import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaAnswerWithDetails = PrismaAnswer & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaAnswerWithDetailsMapper {
  static toDomain(raw: PrismaAnswerWithDetails): AnswerWithDetails {
    return AnswerWithDetails.create({
      answerId: new UniqueEntityId(raw.id),
      questionId: new UniqueEntityId(raw.questionId),
      authorId: new UniqueEntityId(raw.author.id),
      auhtorName: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
    });
  }
}
