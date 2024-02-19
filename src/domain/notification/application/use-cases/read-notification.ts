import { Either, left, right } from "@/core/either";
import { NotificationRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Notification } from "../../enterprise/entities/notification";
import { Injectable } from "@nestjs/common";

interface ReadNotificationUseCaseRequest {
  notificationId: string;
  recipientId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(
      notificationId
    );
    if (!notification) {
      return left(new ResourceNotFoundError());
    }
    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }
    notification.read();
    await this.notificationRepository.save(notification);
    return right({ notification });
  }
}
