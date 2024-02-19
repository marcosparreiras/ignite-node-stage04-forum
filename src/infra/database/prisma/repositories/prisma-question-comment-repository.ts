import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/Prisma-comment-with-author-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaQuestionCommentRepository
  implements QuestionCommentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const data = await this.prisma.comment.findMany({
      where: { questionId },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });
    return data.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);
    await this.prisma.comment.create({ data });
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async findById(questionCommentId: string): Promise<QuestionComment | null> {
    const data = await this.prisma.comment.findFirst({
      where: { id: questionCommentId },
    });

    if (!data) {
      return null;
    }
    return PrismaQuestionCommentMapper.toDomain(data);
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    const data = await this.prisma.comment.findMany({
      where: { questionId },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return data.map(PrismaQuestionCommentMapper.toDomain);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    });
  }
}
