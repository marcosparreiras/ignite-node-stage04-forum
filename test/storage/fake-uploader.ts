import { randomUUID } from "node:crypto";
import {
  Uploader,
  UploadsParams,
} from "@/domain/forum/application/storage/uploader";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadsParams): Promise<{ url: string }> {
    const url = `https//www.storage.com/${fileName}-${randomUUID()}`;
    this.uploads.push({
      fileName,
      url,
    });
    return { url };
  }
}
