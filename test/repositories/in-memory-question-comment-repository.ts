import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentRepository } from "./in-memory-student-repository";

export class InMemoryQuestionCommentRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = [];

  constructor(private studentRepository: InMemoryStudentRepository) {}

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ) {
    const questionCommentsWithAuthor = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((questionComment) => {
        const author = this.studentRepository.items.find((item) =>
          item.id.equals(questionComment.authorId)
        );

        if (!author) {
          throw new Error(
            `Author with ID "${questionComment.authorId.toString()}" does not exist`
          );
        }

        return CommentWithAuthor.create({
          commentId: questionComment.id,
          content: questionComment.content,
          createdAt: questionComment.createdAt,
          updatedAt: questionComment.updatedAt,
          auhtorId: author.id,
          authorName: author.name,
        });
      });

    return questionCommentsWithAuthor;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment) {
    this.items = this.items.filter((item) => item.id !== questionComment.id);
  }

  async findById(questionCommentId: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === questionCommentId
    );
    return questionComment ?? null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
    return questionComments;
  }
}
