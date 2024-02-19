import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { EditQuestionUseCase } from "./edit-question";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;

describe("EditQuestionUseCase", () => {
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

    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository
    );
  });

  it("Should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);
    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attatchmentId: new UniqueEntityId("att-01"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attatchmentId: new UniqueEntityId("att-02"),
      })
    );
    const result = await sut.execute({
      authorId: "author-01",
      questionId: "question-01",
      title: "New Title",
      content: "New Content",
      attachmentsIds: ["att-01", "att-03"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: "New Title",
      content: "New Content",
    });

    expect(
      inMemoryQuestionRepository.items[0].attachments.getItems()
    ).toHaveLength(2);
    expect(inMemoryQuestionRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({
        attatchmentId: new UniqueEntityId("att-01"),
      }),
      expect.objectContaining({
        attatchmentId: new UniqueEntityId("att-03"),
      }),
    ]);
  });

  it("Should sync added and removed attachments when editing a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);
    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attatchmentId: new UniqueEntityId("att-01"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attatchmentId: new UniqueEntityId("att-02"),
      })
    );
    const result = await sut.execute({
      authorId: "author-01",
      questionId: "question-01",
      title: "New Title",
      content: "New Content",
      attachmentsIds: ["att-01", "att-03"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attatchmentId: new UniqueEntityId("att-01"),
        }),
        expect.objectContaining({
          attatchmentId: new UniqueEntityId("att-03"),
        }),
      ])
    );
  });

  it("Should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);
    const result = await sut.execute({
      authorId: "author-02",
      questionId: "question-01",
      title: "New Title",
      content: "New Content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("Should no be able to edit an nonexistent question", async () => {
    const result = await sut.execute({
      authorId: "author-01",
      questionId: "question-01",
      title: "New Title",
      content: "New Content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
