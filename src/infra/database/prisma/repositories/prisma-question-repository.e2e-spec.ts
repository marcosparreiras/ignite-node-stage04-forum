import { QuestionRespository } from "@/domain/forum/application/repositories/question-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("Prisma question repository (e2e)", () => {
  let app: INestApplication;
  let cacheRepository: CacheRepository;
  let questionRepository: QuestionRespository;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    cacheRepository = moduleRef.get(CacheRepository);
    questionRepository = moduleRef.get(QuestionRespository);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  it("Should cache question details", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attatchmentId: attachment.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionRepository.findBySlugWithDetails(
      slug
    );

    const cached = await cacheRepository.get(`question:${slug}:details`);
    expect(cached).toEqual(JSON.stringify(questionDetails));
  });

  it("Should return cached question details on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attatchmentId: attachment.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ test: true })
    );

    const questionDetails = await questionRepository.findBySlugWithDetails(
      slug
    );

    expect(questionDetails).toEqual({ test: true });
  });

  it("Should reset question details cache when saving the question", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attatchmentId: attachment.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ test: true })
    );

    await questionRepository.save(question);
    const cached = await cacheRepository.get(`question:${slug}:details`);
    expect(cached).toBeNull();
  });
});
