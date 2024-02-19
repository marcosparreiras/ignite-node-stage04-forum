import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { ReadNotificationUseCase } from "./read-notification";
import { makeNotification } from "test/factories/make-notification";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe("ReadNotificationUseCase", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository);
  });

  it("Should be able to read a notification", async () => {
    const newNotification = makeNotification();
    await inMemoryNotificationRepository.create(newNotification);

    const result = await sut.execute({
      notificationId: newNotification.id.toString(),
      recipientId: newNotification.recipientId.toString(),
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date)
    );
  });

  it("Should not be able to read another user notification", async () => {
    const newNotification = makeNotification({
      recipientId: new UniqueEntityId("recipient-01"),
    });
    await inMemoryNotificationRepository.create(newNotification);

    const result = await sut.execute({
      notificationId: newNotification.id.toString(),
      recipientId: "recipient-02",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
