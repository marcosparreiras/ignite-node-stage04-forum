import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentRepository } from "./in-memory-student-repository";

export class InMemoryAnswerCommentRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = [];

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ) {
    const commentsWithAuthor = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((answerComment) => {
        const auhtor = this.studentRepository.items.find((item) =>
          item.id.equals(answerComment.authorId)
        );
        if (!auhtor) {
          throw new Error(
            `Auhtor with id ${answerComment.authorId.toString()} does not exist`
          );
        }
        return CommentWithAuthor.create({
          auhtorId: auhtor.id,
          authorName: auhtor.name,
          commentId: answerComment.id,
          content: answerComment.content,
          createdAt: answerComment.createdAt,
          updatedAt: answerComment.updatedAt,
        });
      });
    return commentsWithAuthor;
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async delete(answerComment: AnswerComment) {
    this.items = this.items.filter((item) => item.id !== answerComment.id);
  }

  async findById(answerCommentId: string) {
    const answerComment = this.items.find(
      (item) => item.id.toString() === answerCommentId
    );
    return answerComment ?? null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);
    return answerComments;
  }
}
