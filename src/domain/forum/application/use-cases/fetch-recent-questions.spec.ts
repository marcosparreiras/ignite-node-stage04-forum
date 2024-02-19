import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: FetchRecentQuestionsUseCase;

describe("FetchRecentQuestionsUseCase", () => {
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
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to fetch the most recent questions", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);

    await Promise.all([
      inMemoryQuestionRepository.create(
        makeQuestion({ createdAt: new Date(2024, 0, 2), authorId: author.id })
      ),
      inMemoryQuestionRepository.create(
        makeQuestion({ createdAt: new Date(2024, 0, 1), authorId: author.id })
      ),
      inMemoryQuestionRepository.create(
        makeQuestion({ createdAt: new Date(2024, 0, 3), authorId: author.id })
      ),
    ]);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.questions).toHaveLength(3);
    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2024, 0, 3),
        authorName: author.name,
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 0, 2),
        authorName: author.name,
      }),
      expect.objectContaining({
        createdAt: new Date(2024, 0, 1),
        authorName: author.name,
      }),
    ]);
  });

  it("Should be able to fetch the most recent questions by page", async () => {
    const author = makeStudent();
    inMemoryStudentRepository.items.push(author);
    for (let i = 1; i <= 44; i++) {
      await inMemoryQuestionRepository.create(
        makeQuestion({
          createdAt: new Date(2023, Math.floor(i / 25), (i % 25) + 1),
          authorId: author.id,
        })
      );
    }

    const result = await sut.execute({ page: 2 });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.questions).toHaveLength(20);
    expect(result.value?.questions[0]).toEqual(
      expect.objectContaining({ createdAt: new Date(2023, 0, 25) })
    );
  });
});
