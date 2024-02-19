import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStudent } from "test/factories/make-student";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe("RegisterStudentUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher);
  });

  it("Should be able to register a new student", async () => {
    const result = await sut.execute({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toEqual(true);
    expect(inMemoryStudentRepository.items[0].id).toBeTruthy();
  });

  it("Should hash user password upon registration", async () => {
    const result = await sut.execute({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isHashed = await fakeHasher.compare(
      "123456",
      inMemoryStudentRepository.items[0].password
    );
    expect(result.isRight()).toEqual(true);
    expect(isHashed).toEqual(true);
  });

  it("Should not be able to register a student with same email", async () => {
    const newStudent = makeStudent({ email: "johndoe@example.com" });
    await inMemoryStudentRepository.create(newStudent);
    const result = await sut.execute({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
  });
});
