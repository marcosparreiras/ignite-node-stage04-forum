import { Either, right } from "@/core/either";
import { QuestionRespository } from "../repositories/question-repository";
import { Injectable } from "@nestjs/common";
import { QuestionWithAuthor } from "../../enterprise/entities/value-objects/question-with-author";

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: QuestionWithAuthor[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRespository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecentWithAuthor({
      page,
    });
    return right({ questions });
  }
}
