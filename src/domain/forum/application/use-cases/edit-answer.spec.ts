import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { EditAnswerUseCase } from "./edit-answer";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: EditAnswerUseCase;

describe("EditAnswerUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAttachemntsRepository = new InMemoryAttachemntsRepository();
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachemntsRepository
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentRepository
    );
  });

  it("Should be able to edit an answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(newAnswer);
    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("att-01"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("att-02"),
      })
    );

    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "New Content",
      attachmentsIds: ["att-01", "att-03"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAnswerRepository.items[0].content).toEqual("New Content");
    expect(
      inMemoryAnswerRepository.items[0].attachments.getItems()
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("att-01") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("att-03") }),
    ]);
  });

  it("Should be able to add and remove attchment on answer edition", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(newAnswer);
    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("att-01"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("att-02"),
      })
    );

    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "New Content",
      attachmentsIds: ["att-01", "att-03"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
    expect(inMemoryAnswerAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId("att-01") }),
        expect.objectContaining({ attachmentId: new UniqueEntityId("att-03") }),
      ])
    );
  });

  it("Should not be able to edit an answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(newAnswer);
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-02",
      content: "New Content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to edit an nonexistent answer", async () => {
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "New Content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
