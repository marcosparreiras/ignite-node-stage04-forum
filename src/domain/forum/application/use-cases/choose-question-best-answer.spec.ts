import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("ChooseQuestionBestAnswerUseCase", () => {
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
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachemntsRepository
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionRepository,
      inMemoryAnswerRepository
    );
  });

  it("Should be able to set question best answer", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-02"),
        questionId: newQuestion.id,
      },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(
      newAnswer.id
    );
  });

  it("Should not be able to set a nonexistent answer as the best", async () => {
    const result = await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("Should not be able to set another user question best answer", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-01") },
      new UniqueEntityId("question-01")
    );
    await inMemoryQuestionRepository.create(newQuestion);

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-02"),
        questionId: newQuestion.id,
      },
      new UniqueEntityId("answer-01")
    );
    await inMemoryAnswerRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
