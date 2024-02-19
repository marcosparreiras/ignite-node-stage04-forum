import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRespository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachmentRepository } from "../repositories/question-attachments-repostory";
import { QuestionAttatchmentList } from "../../enterprise/entities/question-attachment-list";
import { Injectable } from "@nestjs/common";

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRespository,
    private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);
    if (!question) {
      return left(new ResourceNotFoundError());
    }
    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);
    const questionAttachmentList = new QuestionAttatchmentList(
      currentQuestionAttachments
    );

    const updatedQuestionAttchments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attatchmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(updatedQuestionAttchments);
    question.attachments = questionAttachmentList;
    question.content = content;
    question.title = title;

    await this.questionRepository.save(question);

    return right({ question });
  }
}
