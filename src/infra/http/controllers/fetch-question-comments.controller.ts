import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-valdiation-pipe";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const fetchQuestionCommentsQuerySchema = z.object({
  page: z.coerce.number().default(1),
});

type FetchQuestionCOmmentsQuerySchema = z.infer<
  typeof fetchQuestionCommentsQuerySchema
>;

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param("questionId") questionId: string,
    @Query(new ZodValidationPipe(fetchQuestionCommentsQuerySchema))
    query: FetchQuestionCOmmentsQuerySchema
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      page: query.page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments.map(
      CommentWithAuthorPresenter.toHTTP
    );
    return { comments };
  }
}
