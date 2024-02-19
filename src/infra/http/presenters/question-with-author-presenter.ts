import { QuestionWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/question-with-author";

export class QuestionWithAuthorPresenter {
  static toHTTP(questionWithAuthor: QuestionWithAuthor) {
    return {
      questionId: questionWithAuthor.questionId.toString(),
      authorId: questionWithAuthor.authorId.toString(),
      authorName: questionWithAuthor.authorName,
      title: questionWithAuthor.title,
      content: questionWithAuthor.content,
      slug: questionWithAuthor.slug.value,
      bestAnswerId: questionWithAuthor.bestAnswerId,
      createdAt: questionWithAuthor.createdAt,
      updatedAt: questionWithAuthor.updatedAt,
    };
  }
}
