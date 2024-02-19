import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
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
import { AnswerWithDetailsPresenter } from "../presenters/answer-with-details-presenter";

const fetchQuestionAnswersQuery = z.object({
  page: z.coerce.number().default(1),
});

type FetchQuestionAnswersQuery = z.infer<typeof fetchQuestionAnswersQuery>;

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param("questionId") questionId: string,
    @Query(new ZodValidationPipe(fetchQuestionAnswersQuery))
    query: FetchQuestionAnswersQuery
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      questionId,
      page: query.page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers.map(AnswerWithDetailsPresenter.toHTTP);
    return { answers };
  }
}
