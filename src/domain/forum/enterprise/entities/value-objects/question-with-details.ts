import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

interface QuestionWithDetailsProps {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  authorName: string;
  title: string;
  content: string;
  slug: Slug;
  attachments: Attachment[];
  bestAnswerId?: UniqueEntityId | null;
  cratedAt: Date;
  updatedAt?: Date | null;
}

export class QuestionWithDetails extends ValueObject<QuestionWithDetailsProps> {
  get questionId() {
    return this.props.questionId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get authorName() {
    return this.props.authorName;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get attachments() {
    return this.props.attachments;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get cratedAt() {
    return this.props.cratedAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuestionWithDetailsProps) {
    return new QuestionWithDetails(props);
  }
}
