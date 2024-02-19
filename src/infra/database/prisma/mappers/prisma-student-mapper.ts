import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        email: raw.email,
        name: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      role: "STUDENT",
      email: student.email,
      name: student.name,
      password: student.password,
    };
  }
}
