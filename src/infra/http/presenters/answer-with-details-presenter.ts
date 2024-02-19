import { AnswerWithDetails } from "@/domain/forum/enterprise/entities/value-objects/answer-with-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class AnswerWithDetailsPresenter {
  static toHTTP(answerWithDetails: AnswerWithDetails) {
    return {
      answerId: answerWithDetails.answerId.toString(),
      authorId: answerWithDetails.authorId.toString(),
      authorName: answerWithDetails.auhtorName,
      questionId: answerWithDetails.questionId.toString(),
      content: answerWithDetails.content,
      attachments: answerWithDetails.attachments.map(
        AttachmentPresenter.toHTTP
      ),
      createdAt: answerWithDetails.createdAt,
      updatedAt: answerWithDetails.updatedAt,
    };
  }
}
