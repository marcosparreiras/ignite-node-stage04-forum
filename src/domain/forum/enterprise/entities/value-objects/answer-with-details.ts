import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Attachment } from "../attachment";

interface AnswerWithDetailsProps {
  answerId: UniqueEntityId;
  authorId: UniqueEntityId;
  auhtorName: string;
  questionId: UniqueEntityId;
  content: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class AnswerWithDetails extends ValueObject<AnswerWithDetailsProps> {
  get answerId() {
    return this.props.answerId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get auhtorName() {
    return this.props.auhtorName;
  }

  get questionId() {
    return this.props.questionId;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: AnswerWithDetailsProps) {
    return new AnswerWithDetails(props);
  }
}
