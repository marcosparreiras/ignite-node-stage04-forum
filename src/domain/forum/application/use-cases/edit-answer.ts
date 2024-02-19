import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRespository } from "../repositories/answers-respository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { AnswerAttachmentRepository } from "../repositories/answer-attchment-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRespository,
    private answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId);
    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments
    );

    const updatedAnswerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityId(attachmentId),
      });
    });

    answerAttachmentsList.update(updatedAnswerAttachments);
    answer.attachments = answerAttachmentsList;
    answer.content = content;
    await this.answerRepository.save(answer);
    return right({ answer });
  }
}
