import { PaginationParams } from "@/core/repositories/Pagination-params";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerWithDetails } from "../../enterprise/entities/value-objects/answer-with-details";

export abstract class AnswerRespository {
  abstract create(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    props: PaginationParams
  ): Promise<Answer[]>;
  abstract findManyWithDetailsByQuestionId(
    questionId: string,
    props: PaginationParams
  ): Promise<AnswerWithDetails[]>;
}
