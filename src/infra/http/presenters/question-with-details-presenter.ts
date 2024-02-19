import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionWithDetailsPresenter {
  static toHTTP(questionWithDetails: QuestionWithDetails) {
    const attachments = questionWithDetails.attachments.map(
      AttachmentPresenter.toHTTP
    );

    return {
      questionId: questionWithDetails.questionId.toString(),
      authorId: questionWithDetails.authorId.toString(),
      authorName: questionWithDetails.authorName,
      title: questionWithDetails.title,
      content: questionWithDetails.content,
      slug: questionWithDetails.slug.value,
      attachments,
      bestAnswerId: questionWithDetails.bestAnswerId?.toString(),
      cratedAt: questionWithDetails.cratedAt,
      updatedAt: questionWithDetails.updatedAt,
    };
  }
}
