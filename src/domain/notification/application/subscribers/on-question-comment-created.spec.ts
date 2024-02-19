import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { SpyInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { OnQuestionCommentCreated } from "./on-question-comment-created";
import { InMemoryQuestionCommentRepository } from "test/repositories/in-memory-question-comment-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryQuestionRepository } from "test/repositories/in-memory-question-repository";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionRepository: InMemoryQuestionRepository;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe("OnQuestionCommentCreated", () => {
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

    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");
    new OnQuestionCommentCreated(
      inMemoryQuestionRepository,
      sendNotificationUseCase
    );
  });

  it("Should be able to send notification after a answer comment is create", async () => {
    const question = makeQuestion({}, new UniqueEntityId("question-01"));
    await inMemoryQuestionRepository.create(question);

    const questionComment = makeQuestionComment({ questionId: question.id });
    await inMemoryQuestionCommentRepository.create(questionComment);

    waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
