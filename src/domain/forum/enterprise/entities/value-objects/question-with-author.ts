import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Slug } from "./slug";

interface QuestionWithAuthorProps {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  authorName: string;
  title: string;
  content: string;
  slug: Slug;
  bestAnswerId?: UniqueEntityId | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionWithAuthor extends ValueObject<QuestionWithAuthorProps> {
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
  get bestAnswerId() {
    return this.props.bestAnswerId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuestionWithAuthorProps) {
    return new QuestionWithAuthor({ ...props });
  }
}
