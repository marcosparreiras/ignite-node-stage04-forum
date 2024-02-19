import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: GetQuestionBySlugUseCase;

describe("GetQuestionBySlugUseCase", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAttachemntsRepository = new InMemoryAttachemntsRepository();

    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachemntsRepository
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to get a question by slug", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);

    const attachment = makeAttachment();
    inMemoryAttachemntsRepository.items.push(attachment);

    const question = makeQuestion({
      slug: Slug.create("fake-question"),
      authorId: author.id,
    });
    inMemoryQuestionRepository.create(question);

    const questionAttachment = makeQuestionAttachment({
      questionId: question.id,
      attatchmentId: attachment.id,
    });
    inMemoryQuestionAttachmentRepository.items.push(questionAttachment);

    const result = await sut.execute({ slug: "fake-question" });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items[0].id).toEqual(question.id);
    expect(result.value).toEqual(
      expect.objectContaining({
        question: {
          props: expect.objectContaining({
            authorName: author.name,
            attachments: [attachment],
            title: question.title,
          }),
        },
      })
    );
  });

  it("Should not be possible to seacrh an nonexistent question", async () => {
    const result = await sut.execute({
      slug: "fake-question",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
