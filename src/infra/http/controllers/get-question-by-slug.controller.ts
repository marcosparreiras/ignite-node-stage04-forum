import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { QuestionWithDetailsPresenter } from "../presenters/question-with-details-presenter";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlug.execute({ slug });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const question = QuestionWithDetailsPresenter.toHTTP(result.value.question);
    return { question };
  }
}
