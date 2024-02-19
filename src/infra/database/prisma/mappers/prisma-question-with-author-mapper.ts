import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/question-with-author";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion, User as PrismaUser } from "@prisma/client";

type PrismaQuestionWithAuthor = PrismaQuestion & { author: PrismaUser };

export class PrismaQuestionWithAuthorMapper {
  static toDomain(raw: PrismaQuestionWithAuthor): QuestionWithAuthor {
    return QuestionWithAuthor.create({
      authorId: new UniqueEntityId(raw.authorId),
      authorName: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      questionId: new UniqueEntityId(raw.id),
      slug: Slug.create(raw.slug),
      title: raw.title,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      updatedAt: raw.updatedAt,
    });
  }
}
