import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CreateQuestionUseCase;

describe("CreateQuestionUseCase", () => {
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
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
  });

  it("Should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "01",
      title: "Fake Question",
      content: "Fake content...",
      attatchmentsIds: ["attatchment-01", "attatchment-02"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question);
    expect(
      inMemoryQuestionRepository.items[0].attachments.getItems()
    ).toHaveLength(2);
    expect(inMemoryQuestionRepository.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({
        attatchmentId: new UniqueEntityId("attatchment-01"),
      }),
      expect.objectContaining({
        attatchmentId: new UniqueEntityId("attatchment-02"),
      }),
    ]);
  });

  it("Should persist attachemnts when creating a new question", async () => {
    const result = await sut.execute({
      authorId: "01",
      title: "Fake Question",
      content: "Fake content...",
      attatchmentsIds: ["attatchment-01", "attatchment-02"],
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2);
  });
});
