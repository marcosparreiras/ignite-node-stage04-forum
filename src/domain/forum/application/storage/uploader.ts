export interface UploadsParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export abstract class Uploader {
  abstract upload(params: UploadsParams): Promise<{ url: string }>;
}
