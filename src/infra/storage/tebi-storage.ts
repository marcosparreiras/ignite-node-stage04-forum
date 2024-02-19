import { randomUUID } from "node:crypto";
import {
  Uploader,
  UploadsParams,
} from "@/domain/forum/application/storage/uploader";
import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";

@Injectable()
export class TebiStorage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: "https://s3.tebi.io",
      region: "global",
      credentials: {
        accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: envService.get("AWS_SECRET_KEY_ID"),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadsParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get("AWS_BUCKET_NAME"),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    );

    return {
      url: uniqueFileName,
    };
  }
}
