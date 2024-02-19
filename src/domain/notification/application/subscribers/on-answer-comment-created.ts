import { EventHandler } from "@/core/events/event-hanlder";
import { AnswerRespository } from "@/domain/forum/application/repositories/answers-respository";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/eventes/answer-comment-created";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answerRepository: AnswerRespository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendAnswerCommentCreatedNotification.bind(this),
      AnswerCommentCreatedEvent.name
    );
  }

  async sendAnswerCommentCreatedNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.toString()
    );
    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: "Um comentário foi criado na sua responta",
        content: `A resposta que você enviou "${answer.content
          .substring(0, 20)
          .concat("...")}" foi comentada`,
      });
    }
  }
}
