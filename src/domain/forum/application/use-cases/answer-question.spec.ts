import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { AnswerQuestionUseCase } from "./answer-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachmentRepository: InMemoryAttachemntsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: AnswerQuestionUseCase;

describe("AnswerQuestionUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAttachmentRepository = new InMemoryAttachemntsRepository();
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository,
      inMemoryStudentRepository,
      inMemoryAttachmentRepository
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);
  });

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      authorId: "01",
      questionId: "01",
      content: "test answer",
      attachmentsIds: ["att-01", "att-02"],
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.answer.id).toBeTruthy();
    expect(inMemoryAnswerRepository.items[0].id).toEqual(
      result.value?.answer.id
    );
    expect(
      inMemoryAnswerRepository.items[0].attachments.getItems()
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("att-01") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("att-02") }),
    ]);
  });

  it("should be able to persist attachments on answer creation", async () => {
    const result = await sut.execute({
      authorId: "01",
      questionId: "01",
      content: "test answer",
      attachmentsIds: ["att-01", "att-02"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(2);
  });
});
