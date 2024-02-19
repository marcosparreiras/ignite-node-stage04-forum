import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionRespository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/question-with-author";
import { InMemoryStudentRepository } from "./in-memory-student-repository";
import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { InMemoryAttachemntsRepository } from "./in-memory-attachments-repository";
import { InMemoryQuestionAttachmentRepository } from "./in-memory-question-attachment-repository";

export class InMemoryQuestionRepository implements QuestionRespository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private studentRepository: InMemoryStudentRepository,
    private attachmentRepository: InMemoryAttachemntsRepository
  ) {}

  async findBySlugWithDetails(
    slug: string
  ): Promise<QuestionWithDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug);
    if (!question) {
      return null;
    }
    const author = this.studentRepository.items.find((student) =>
      student.id.equals(question.authorId)
    );
    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist`
      );
    }
    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id)
    );

    const attachments = questionAttachments.map((questionAttchment) => {
      const attachment = this.attachmentRepository.items.find((attachment) =>
        attachment.id.equals(questionAttchment.attatchmentId)
      );
      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttchment.attatchmentId.toString()}" does not exist`
        );
      }
      return attachment;
    });

    return QuestionWithDetails.create({
      authorId: author.id,
      authorName: author.name,
      cratedAt: question.createdAt,
      questionId: question.id,
      slug: question.slug,
      title: question.title,
      bestAnswerId: question.bestAnswerId,
      updatedAt: question.updatedAt,
      content: question.content,
      attachments,
    });
  }

  async findManyRecentWithAuthor(params: PaginationParams) {
    const questionsWithAuthor = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
      .map((question) => {
        const auhtor = this.studentRepository.items.find((student) =>
          student.id.equals(question.authorId)
        );
        if (!auhtor) {
          throw new Error(
            `Author with ID "${question.id.toString()}" does not exist`
          );
        }
        return QuestionWithAuthor.create({
          questionId: question.id,
          authorId: auhtor.id,
          authorName: auhtor.name,
          title: question.title,
          content: question.content,
          slug: question.slug,
          bestAnswerId: question.bestAnswerId,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        });
      });
    return questionsWithAuthor;
  }

  async create(question: Question) {
    this.items.push(question);
    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);
    this.items[index] = question;
    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems()
    );
    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems()
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    this.items = this.items.filter((item) => item.id !== question.id);
    await this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
    return questions;
  }

  async findById(questionId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId
    );
    return question ?? null;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);
    return question ?? null;
  }
}
