import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "./delete-question";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { QuestionAttatchmentList } from "../../enterprise/entities/question-attachment-list";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: DeleteQuestionUseCase;

describe("DeleteQuestionUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAttachemntsRepository = new InMemoryAttachemntsRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachemntsRepository
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("auhtor-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "auhtor-01",
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  it("Should delete attachments when delete a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("auhtor-01") },
      new UniqueEntityId("question-01")
    );

    const questionAttachment01 = makeQuestionAttachment({
      questionId: newQuestion.id,
      attatchmentId: new UniqueEntityId("att-01"),
    });

    const questionAttachment02 = makeQuestionAttachment({
      questionId: newQuestion.id,
      attatchmentId: new UniqueEntityId("att-02"),
    });

    newQuestion.attachments = new QuestionAttatchmentList([
      questionAttachment01,
      questionAttachment02,
    ]);

    await inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "auhtor-01",
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("auhtor-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: "question-01",
      authorId: "auhtor-02",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("Should not be able to delete an nonexistent question", async () => {
    const result = await sut.execute({
      questionId: "question-01",
      authorId: "auhtor-01",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
