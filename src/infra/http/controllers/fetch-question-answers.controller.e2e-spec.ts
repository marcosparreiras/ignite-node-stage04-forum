import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("fetch question answers (e2e)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;

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

    await app.init();
  });

  test("[GET] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const [answer01, answer02, answer03] = await Promise.all([
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      }),
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      }),
      answerFactory.makePrismaAnswer({
        authorId: user.id,
        questionId: question.id,
      }),
    ]);

    const [attachment01, attachment02, attachment03] = await Promise.all([
      await attachmentFactory.makePrismaAttachment(),
      await attachmentFactory.makePrismaAttachment(),
      await attachmentFactory.makePrismaAttachment(),
    ]);

    await Promise.all([
      await answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer01.id,
        attachmentId: attachment01.id,
      }),
      await answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer02.id,
        attachmentId: attachment02.id,
      }),
      await answerAttachmentFactory.makePrismaAnswerAttachment({
        answerId: answer03.id,
        attachmentId: attachment03.id,
      }),
    ]);

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.answers).toHaveLength(3);
    expect(response.body.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: user.name,
          attachments: [expect.objectContaining({ title: attachment01.title })],
          content: answer01.content,
        }),
        expect.objectContaining({
          authorName: user.name,
          attachments: [expect.objectContaining({ title: attachment02.title })],
          content: answer02.content,
        }),
        expect.objectContaining({
          authorName: user.name,
          attachments: [expect.objectContaining({ title: attachment03.title })],
          content: answer03.content,
        }),
      ])
    );
  });
});
