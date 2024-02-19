import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { DeleteAnswerUseCase } from "./delete-answer";
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
let sut: DeleteAnswerUseCase;

describe("DeleteAnswerUseCase", () => {
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
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
  });

  it("Should be able to delete an answer", async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(answer);
    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({ answerId: answer.id }),
      makeAnswerAttachment({ answerId: answer.id })
    );
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
    });
    expect(result.isRight()).toEqual(true);
    expect(inMemoryAnswerRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete an answer from another user", async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityId("auhtor-01") },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(answer);
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to delete an nonexistent answer", async () => {
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
    });
    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
