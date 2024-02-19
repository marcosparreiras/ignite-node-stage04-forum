import { InMemoryAttachemntsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

let inMemoryAttachemntsRepository: InMemoryAttachemntsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("UploadAndCreateAttachmentUseCase", () => {
  beforeEach(() => {
    inMemoryAttachemntsRepository = new InMemoryAttachemntsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachemntsRepository,
      fakeUploader
    );
  });

  it("Should be able to create and upload an attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        attachment: inMemoryAttachemntsRepository.items[0],
      })
    );
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
      })
    );
  });

  it("Should not be able to create and upload an attachment with incorrect file type", async () => {
    const result = await sut.execute({
      fileName: "music.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
