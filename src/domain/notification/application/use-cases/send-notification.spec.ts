import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { SendNotificationUseCase } from "./send-notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

describe("SendNotificationUseCase", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationRepository);
  });

  it("Should be able to send notification", async () => {
    const result = await sut.execute({
      recipientId: "recipient-01",
      title: "fake title",
      content: "fake content",
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value?.notification).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityId("recipient-01"),
        title: "fake title",
        content: "fake content",
      })
    );
    expect(inMemoryNotificationRepository.items).toHaveLength(1);
  });
});
