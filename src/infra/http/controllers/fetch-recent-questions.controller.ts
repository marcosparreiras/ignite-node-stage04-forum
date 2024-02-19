import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-valdiation-pipe";
import { z } from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionWithAuthorPresenter } from "../presenters/question-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Query("page", queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({ page });
    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const { questions } = result.value;
    return { questions: questions.map(QuestionWithAuthorPresenter.toHTTP) };
  }
}
