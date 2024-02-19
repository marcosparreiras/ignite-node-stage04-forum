import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import {
  BadGatewayException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-valdiation-pipe";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const fetchAnswerCommentsQuerySchema = z.object({
  page: z.coerce.number().default(1),
});

type FetchAnswerCommentsQuerySchema = z.infer<
  typeof fetchAnswerCommentsQuerySchema
>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param("answerId") answerId: string,
    @Query(new ZodValidationPipe(fetchAnswerCommentsQuerySchema))
    query: FetchAnswerCommentsQuerySchema
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      page: query.page,
    });

    if (result.isLeft()) {
      throw new BadGatewayException();
    }

    const comments = result.value.comments.map(
      CommentWithAuthorPresenter.toHTTP
    );
    return { comments };
  }
}
