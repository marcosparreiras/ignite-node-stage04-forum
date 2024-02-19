import { Module } from "@nestjs/common";
import { TebiStorage } from "./tebi-storage";
import { Uploader } from "@/domain/forum/application/storage/uploader";
import { EnvModule } from "../env/env.module";

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: TebiStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
