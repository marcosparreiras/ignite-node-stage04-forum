import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attchment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  public items: AnswerAttachment[] = [];

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const attachmentsIds = attachments.map((attachment) => attachment.id);
    this.items = this.items.filter((item) => !attachmentsIds.includes(item.id));
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId
    );
  }

  async findManyByAnswerId(answerId: string) {
    const answerAttchments = this.items.filter(
      (item) => item.answerId.toString() === answerId
    );
    return answerAttchments;
  }
}
