import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionRespository } from "../repositories/question-repository";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttatchmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attatchmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question;
  }
>;

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRespository) {}

  async execute({
    authorId,
    title,
    content,
    attatchmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    const questionAttatchments = attatchmentsIds.map((attatchmentId) => {
      return QuestionAttachment.create({
        attatchmentId: new UniqueEntityId(attatchmentId),
        questionId: question.id,
      });
    });

    question.attachments = new QuestionAttatchmentList(questionAttatchments);
    await this.questionRepository.create(question);

    return right({ question });
  }
}
