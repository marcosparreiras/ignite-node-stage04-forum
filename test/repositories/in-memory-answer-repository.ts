import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerRespository } from "@/domain/forum/application/repositories/answers-respository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { InMemoryStudentRepository } from "./in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "./in-memory-attachments-repository";
import { InMemoryAnswerAttachmentRepository } from "./in-memory-answer-attachment-repository";
import { AnswerWithDetails } from "@/domain/forum/enterprise/entities/value-objects/answer-with-details";

export class InMemoryAnswerRepository implements AnswerRespository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentRepository: InMemoryAnswerAttachmentRepository,
    private studentRepository: InMemoryStudentRepository,
    private attachmentRepository: InMemoryAttachemntsRepository
  ) {}

  async findManyWithDetailsByQuestionId(
    questionId: string,
    props: PaginationParams
  ) {
    const answersWithDetails = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((props.page - 1) * 20, props.page * 20)
      .map((answer) => {
        const auhtor = this.studentRepository.items.find((student) =>
          student.id.equals(answer.authorId)
        );
        if (!auhtor) {
          throw new Error(
            `Auhtor with ID "${answer.authorId.toString()}" does not exist`
          );
        }
        const answerAttachemnt = this.answerAttachmentRepository.items.filter(
          (answerAttachemnt) => answerAttachemnt.answerId.equals(answer.id)
        );
        const attachments = answerAttachemnt.map((answerAttachment) => {
          const attachment = this.attachmentRepository.items.find(
            (attachment) => attachment.id.equals(answerAttachment.answerId)
          );
          if (!attachment) {
            throw new Error(
              `Attachment with ID "${answerAttachment.attachmentId.toString()}" does not exist`
            );
          }
          return attachment;
        });
        return AnswerWithDetails.create({
          authorId: auhtor.id,
          auhtorName: auhtor.name,
          answerId: answer.id,
          questionId: answer.questionId,
          content: answer.content,
          createdAt: answer.createdAt,
          updatedAt: answer.updatedAt,
          attachments,
        });
      });
    return answersWithDetails;
  }

  async create(answer: Answer) {
    this.items.push(answer);
    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems()
    );
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    this.items = this.items.filter((item) => item.id !== answer.id);
    await this.answerAttachmentRepository.deleteManyByAnswerId(
      answer.id.toString()
    );
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
    return answers;
  }

  async save(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id);
    this.items[index] = answer;
    await this.answerAttachmentRepository.createMany(
      answer.attachments.getNewItems()
    );
    await this.answerAttachmentRepository.deleteMany(
      answer.attachments.getRemovedItems()
    );
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);
    return answer ?? null;
  }
}
