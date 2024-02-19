import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeNotification(
  overide: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...overide,
    },
    id
  );
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(overide: Partial<NotificationProps> = {}) {
    const notification = makeNotification(overide);
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });
    return notification;
  }
}
