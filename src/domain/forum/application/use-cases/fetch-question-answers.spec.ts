import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudent } from "test/factories/make-student";
import { AnswerWithDetails } from "../../enterprise/entities/value-objects/answer-with-details";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: FetchQuestionAnswersUseCase;

describe("FetchRecentAnswersUseCase", () => {
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
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
  });

  it("Should be able to fetch answers by question id", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);

    await Promise.all([
      inMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("question-01"),
          authorId: author.id,
        })
      ),
      inMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("question-01"),
          authorId: author.id,
        })
      ),
      inMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("question-02"),
          authorId: author.id,
        })
      ),
    ]);

    const result = await sut.execute({
      questionId: "question-01",
      page: 1,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answers).toHaveLength(2);
    expect(result.value?.answers[0].questionId.toString()).toEqual(
      "question-01"
    );
    expect(result.value?.answers[0]).toBeInstanceOf(AnswerWithDetails);
  });

  it("Should be able to fetch question answers by page", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId("question-01"),
          authorId: author.id,
        })
      );
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});
