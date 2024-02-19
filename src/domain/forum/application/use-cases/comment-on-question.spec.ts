import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let sut: CommentOnQuestionUseCase;

describe("CommentOnQuestionUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAttachemntsRepository = new InMemoryAttachemntsRepository();
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository
    );
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachemntsRepository
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentRepository
    );
  });

  it("Should be able to comment on question", async () => {
    const newQuestion = makeQuestion({});
    await inMemoryQuestionRepository.create(newQuestion);
    const result = await sut.execute({
      authorId: "author-01",
      questionId: newQuestion.id.toString(),
      content: "Fake Comment",
    });
    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
      "Fake Comment"
    );
  });
});
