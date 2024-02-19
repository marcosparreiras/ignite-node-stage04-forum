import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;

describe("FetchQuestionCommentsUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
  });

  it("Should be able to fetch question comments", async () => {
    const student = makeStudent();
    inMemoryStudentRepository.items.push(student);

    await Promise.all([
      inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("question-01"),
          authorId: student.id,
        })
      ),
      inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("question-01"),
          authorId: student.id,
        })
      ),
      inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("question-02"),
          authorId: student.id,
        })
      ),
    ]);

    const result = await sut.execute({
      page: 1,
      questionId: "question-01",
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.comments).toHaveLength(2);
  });

  it("Should be able to fetch question comments by page", async () => {
    const student = makeStudent();
    inMemoryStudentRepository.items.push(student);
    for (let i = 1; i <= 23; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId("question-01"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: "question-01",
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.comments).toHaveLength(3);
  });
});
