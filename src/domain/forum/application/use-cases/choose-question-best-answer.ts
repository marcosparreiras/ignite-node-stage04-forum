import { Question } from "../../enterprise/entities/question";
import { QuestionRespository } from "../repositories/question-repository";
import { AnswerRespository } from "../repositories/answers-respository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface ChooseQuestionBestAnswerUseCaseRequest {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRespository: QuestionRespository,
    private answerRepository: AnswerRespository
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    const question = await this.questionRespository.findById(
      answer.questionId.toString()
    );
    if (!question) {
      return left(new ResourceNotFoundError());
    }
    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    question.bestAnswerId = answer.id;
    await this.questionRespository.save(question);
    return right({ question });
  }
}
