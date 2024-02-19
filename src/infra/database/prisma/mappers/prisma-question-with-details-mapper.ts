import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionWithDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionWithDetailsMapper {
  static toDomain(raw: PrismaQuestionWithDetails): QuestionWithDetails {
    return QuestionWithDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.author.id),
      authorName: raw.author.name,
      cratedAt: raw.createdAt,
      slug: Slug.create(raw.slug),
      title: raw.title,
      content: raw.content,
      updatedAt: raw.updatedAt,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
    });
  }
}
