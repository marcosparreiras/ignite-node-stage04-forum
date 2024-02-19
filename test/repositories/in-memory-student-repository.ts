import { StudentRepository } from "@/domain/forum/application/repositories/student-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentRepository implements StudentRepository {
  public items: Student[] = [];

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email === email);
    return student ?? null;
  }

  async create(student: Student): Promise<void> {
    this.items.push(student);
  }
}
