import { PaginationParams } from "@/core/repositories/Pagination-params";
import { AnswerRespository } from "@/domain/forum/application/repositories/answers-respository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attchment-repository";
import { AnswerWithDetails } from "@/domain/forum/enterprise/entities/value-objects/answer-with-details";
import { PrismaAnswerWithDetailsMapper } from "../mappers/prisma-answer-with-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaAnswerRepository implements AnswerRespository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async findManyWithDetailsByQuestionId(
    questionId: string,
    props: PaginationParams
  ): Promise<AnswerWithDetails[]> {
    const answersWithDetails = await this.prisma.answer.findMany({
      where: { questionId },
      include: {
        author: true,
        attachments: true,
      },
      skip: (props.page - 1) * 20,
      take: 20,
    });
    return answersWithDetails.map(PrismaAnswerWithDetailsMapper.toDomain);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({ where: { id } });
    if (!answer) {
      return null;
    }
    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    props: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      skip: (props.page - 1) * 20,
      take: 20,
    });
    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.create({ data });
    DomainEvents.dispatchEventsForAggregate(answer.id);
    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems()
    );
  }

  async delete(answer: Answer): Promise<void> {
    await Promise.all([
      this.prisma.answer.delete({ where: { id: answer.id.toString() } }),
      this.answerAttachmentRepository.deleteManyByAnswerId(
        answer.id.toString()
      ),
    ]);
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await Promise.all([
      this.prisma.answer.update({ where: { id: data.id }, data }),
      this.answerAttachmentRepository.createMany(
        answer.attachments.getNewItems()
      ),
      this.answerAttachmentRepository.deleteMany(
        answer.attachments.getRemovedItems()
      ),
    ]);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
