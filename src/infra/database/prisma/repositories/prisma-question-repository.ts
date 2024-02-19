import { PaginationParams } from "@/core/repositories/Pagination-params";
import { QuestionRespository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repostory";
import { QuestionWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/question-with-author";
import { PrismaQuestionWithAuthorMapper } from "../mappers/prisma-question-with-author-mapper";
import { PrismaQuestionWithDetailsMapper } from "../mappers/prisma-question-with-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaQuestionRepository implements QuestionRespository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) {}

  async findBySlugWithDetails(slug: string) {
    const cacheHit = await this.cache.get(`question:${slug}:details`);
    if (cacheHit) {
      return JSON.parse(cacheHit);
    }

    const questionWithDetails = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        attachments: true,
      },
    });
    if (!questionWithDetails) {
      return null;
    }

    const domainQuestionWithDetails =
      PrismaQuestionWithDetailsMapper.toDomain(questionWithDetails);
    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(domainQuestionWithDetails)
    );
    return domainQuestionWithDetails;
  }

  async findManyRecentWithAuthor(
    params: PaginationParams
  ): Promise<QuestionWithAuthor[]> {
    const questionWithAuthor = await this.prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questionWithAuthor.map(PrismaQuestionWithAuthorMapper.toDomain);
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return null;
    }
    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { slug } });
    if (!question) {
      return null;
    }
    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      skip: (params.page - 1) * 20,
    });
    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.create({ data });
    DomainEvents.dispatchEventsForAggregate(question.id);
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems()
    );
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await Promise.all([
      this.prisma.question.update({
        where: { id: data.id },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems()
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
      this.cache.delete(`question:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    await Promise.all([
      this.prisma.question.delete({
        where: { id: question.id.toString() },
      }),
      this.questionAttachmentsRepository.deleteManyByQuestionId(
        question.id.toString()
      ),
    ]);
  }
}
