import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class CommentWithAuthorPresenter {
  static toHTTP(commentWithAuhtor: CommentWithAuthor) {
    return {
      commentId: commentWithAuhtor.commentId.toString(),
      auhtorId: commentWithAuhtor.auhtorId.toString(),
      content: commentWithAuhtor.content,
      authorName: commentWithAuhtor.authorName,
      createdAt: commentWithAuhtor.createdAt,
      updatedAt: commentWithAuhtor.updatedAt,
    };
  }
}
