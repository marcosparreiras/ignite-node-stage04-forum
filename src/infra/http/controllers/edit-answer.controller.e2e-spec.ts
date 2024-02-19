import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Edit answer (e2e)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[Put] /answers/id", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const [attachment01, attachment02, attachment03] = await Promise.all([
      await attachmentFactory.makePrismaAttachment(),
      await attachmentFactory.makePrismaAttachment(),
      await attachmentFactory.makePrismaAttachment(),
    ]);

    await Promise.all([
      await answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer.id,
        attachmentId: attachment01.id,
      }),
      await answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer.id,
        attachmentId: attachment02.id,
      }),
    ]);

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Edited Answer",
        attachmentsIds: [
          attachment01.id.toString(),
          attachment03.id.toString(),
        ],
      });

    expect(response.statusCode).toEqual(204);

    const answerOnRepository = await prisma.answer.findFirst({
      where: { questionId: question.id.toString() },
    });
    expect(answerOnRepository?.content).toEqual("Edited Answer");

    const attachmentsOnRepository = await prisma.attachment.findMany({
      where: { answerId: answer.id.toString() },
    });
    expect(attachmentsOnRepository).toHaveLength(2);
    expect(attachmentsOnRepository).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment01.id.toString() }),
        expect.objectContaining({ id: attachment03.id.toString() }),
      ])
    );
  });
});
