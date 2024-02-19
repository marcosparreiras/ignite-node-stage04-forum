import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-valdiation-pipe";

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBodySchema,
    @Param("questionId") questionId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.answerQuestion.execute({
      authorId: user.sub,
      questionId,
      ...body,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
