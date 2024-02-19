import { WatchedList } from "@/core/entities/watched-list";
import { QuestionAttachment } from "./question-attachment";

export class QuestionAttatchmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment) {
    return a.attatchmentId.equals(b.attatchmentId);
  }
}
