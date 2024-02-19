import { PaginationParams } from "@/core/repositories/Pagination-params";
import { Question } from "../../enterprise/entities/question";
import { QuestionWithAuthor } from "../../enterprise/entities/value-objects/question-with-author";
import { QuestionWithDetails } from "../../enterprise/entities/value-objects/question-with-details";

export abstract class QuestionRespository {
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findManyRecentWithAuthor(
    params: PaginationParams
  ): Promise<QuestionWithAuthor[]>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract findById(questionId: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findBySlugWithDetails(
    slug: string
  ): Promise<QuestionWithDetails | null>;
}
