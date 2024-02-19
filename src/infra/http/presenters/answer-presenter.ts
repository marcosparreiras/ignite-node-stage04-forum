import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      questionId: answer.questionId.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  }
}
