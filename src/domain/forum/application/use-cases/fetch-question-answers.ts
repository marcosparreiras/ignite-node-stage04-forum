import { Either, right } from "@/core/either";
import { AnswerRespository } from "../repositories/answers-respository";
import { Injectable } from "@nestjs/common";
import { AnswerWithDetails } from "../../enterprise/entities/value-objects/answer-with-details";

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: AnswerWithDetails[];
  }
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRespository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answerRepository.findManyWithDetailsByQuestionId(
      questionId,
      {
        page,
      }
    );
    return right({ answers });
  }
}
