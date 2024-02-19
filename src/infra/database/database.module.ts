import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionRepository } from "./prisma/repositories/prisma-question-repository";
import { PrismaQuestionCommentRepository } from "./prisma/repositories/prisma-question-comment-repository";
import { PrismaQuestionAttchmentRepository } from "./prisma/repositories/prisma-question-attachment-repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answer-repository";
import { PrismaAnswerAttachmentRepository } from "./prisma/repositories/prisma-answer-attchment-repository";
import { PrismaAnswerCommentRepository } from "./prisma/repositories/prisma-answer-comment-repository";
import { QuestionRespository } from "@/domain/forum/application/repositories/question-repository";
import { AnswerRespository } from "@/domain/forum/application/repositories/answers-respository";
import { QuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repostory";
import { AnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attchment-repository";
import { StudentRepository } from "@/domain/forum/application/repositories/student-repository";
import { PrismaStudentRepository } from "./prisma/repositories/prisma-student-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentRespository } from "./prisma/repositories/prisma-attachment-repository";
import { PrismaNotificationRepository } from "./prisma/repositories/prisma-notification-repository";
import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionRespository,
      useClass: PrismaQuestionRepository,
    },

    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttchmentRepository,
    },
    {
      provide: AnswerRespository,
      useClass: PrismaAnswerRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentRespository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionRespository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswerRespository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    StudentRepository,
    AttachmentsRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
