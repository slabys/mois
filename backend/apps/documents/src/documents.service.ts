import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { renderToBuffer } from "@react-pdf/renderer";
import { FileStorageService } from "modules/file-storage";
import { SampleDocument } from "./components/components";

@Injectable()
export class DocumentsService implements OnApplicationBootstrap {
  constructor(private readonly storageService: FileStorageService) {}

  async onApplicationBootstrap() {
    const buffer = await renderToBuffer(
      SampleDocument({organization: "UHK", customer: "Jan Novák", text: "This is PDF content" })
    );

    await this.storageService.save("documents/sample.pdf", buffer);
  }
}
