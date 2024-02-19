import { InMemoryAnswerCommentRepository } from "test/repositories/in-memory-answer-comment-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
let sut: FetchAnswerCommentsUseCase;

describe("FetchAnswerCommentsUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();

    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository);
  });

  it("Should be able to fetch answer comments", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);

    await Promise.all([
      inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("answer-01"),
          authorId: author.id,
        })
      ),
      inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("answer-01"),
          authorId: author.id,
        })
      ),
      inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("answer-02"),
          authorId: author.id,
        })
      ),
    ]);

    const result = await sut.execute({
      answerId: "answer-01",
      page: 1,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.comments).toHaveLength(2);
  });

  it("Should be able to fetch answer comments by page", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);

    for (let i = 1; i <= 23; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId("answer-01"),
          authorId: author.id,
        })
      );
    }

    const result = await sut.execute({
      answerId: "answer-01",
      page: 2,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.comments).toHaveLength(3);
  });
});
