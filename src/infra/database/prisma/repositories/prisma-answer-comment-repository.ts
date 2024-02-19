import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/Prisma-comment-with-author-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaAnswerCommentRepository implements AnswerCommentRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    const data = await this.prisma.comment.findMany({
      where: { answerId },
      include: {
        author: true,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return data.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);
    await this.prisma.comment.create({ data });
    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const data = await this.prisma.comment.findFirst({
      where: { id: answerCommentId },
    });
    if (!data) {
      return null;
    }
    return PrismaAnswerCommentMapper.toDomain(data);
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    const data = await this.prisma.comment.findMany({
      where: { answerId },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return data.map(PrismaAnswerCommentMapper.toDomain);
  }
}
