import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentRepository } from "test/repositories/in-memory-student-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStudent } from "test/factories/make-student";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let inMemoryStudentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("AuthenticateStudentUseCase", () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("Should be able to authenticate a student", async () => {
    const newStudent = makeStudent({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });
    await inMemoryStudentRepository.create(newStudent);
    const result = await sut.execute({
      email: newStudent.email,
      password: "123456",
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );
  });

  it("Should not be able to authenticate a student with wrong password", async () => {
    const newStudent = makeStudent({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });
    await inMemoryStudentRepository.create(newStudent);
    const result = await sut.execute({
      email: newStudent.email,
      password: "654321",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });

  it("Should not be able to authenticate a student with wrong email", async () => {
    const newStudent = makeStudent({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });
    await inMemoryStudentRepository.create(newStudent);
    const result = await sut.execute({
      email: "nonexistent@email.com",
      password: "123456",
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
