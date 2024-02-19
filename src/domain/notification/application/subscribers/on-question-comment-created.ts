import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-hanlder";
import { QuestionRespository } from "@/domain/forum/application/repositories/question-repository";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/eventes/question-comment-created";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionRespository,
    private sendNotification: SendNotificationUseCase
  ) {}

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionCommentCreatedNotification.bind(this),
      QuestionCommentCreatedEvent.name
    );
  }

  async sendQuestionCommentCreatedNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionRepository.findById(
      questionComment.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: "Um comentário foi criado na sua pergunta",
        content: `A pergunta que você criou "${question.title
          .substring(0, 20)
          .concat("...")}" foi comentada`,
      });
    }
  }
}
