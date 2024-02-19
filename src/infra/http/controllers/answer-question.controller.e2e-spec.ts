import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { AttachmentFactory } from "test/factories/make-attachment";

describe("Answer question (e2e)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /answers", async () => {
    const user = await studentFactory.makePrismaStudent();
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const attachment = await attachmentFactory.makePrismaAttachment();

    const token = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Fake answer",
        attachmentsIds: [attachment.id.toString()],
      });

    expect(response.statusCode).toEqual(201);
    const answerOnDatabase = await prisma.answer.findFirst({
      where: { questionId: question.id.toString() },
    });
    const attachmentOnDataBase = await prisma.attachment.findUnique({
      where: { id: attachment.id.toString() },
    });
    expect(answerOnDatabase?.content).toEqual("Fake answer");
    expect(attachmentOnDataBase?.answerId).toEqual(answerOnDatabase?.id);
  });
});
