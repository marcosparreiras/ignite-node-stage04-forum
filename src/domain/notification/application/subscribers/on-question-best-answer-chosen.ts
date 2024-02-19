import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-hanlder";
import { AnswerRespository } from "@/domain/forum/application/repositories/answers-respository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/eventes/question-best-answer-chosen";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRespository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString()
    );
    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: "Sua resposta foi escolhida como melhor resposta!",
        content: `A resposta que voce enviou em "${question.title
          .substring(0, 10)
          .concat("...")}" foi escolhida pelo autor.`,
      });
    }
  }
}
