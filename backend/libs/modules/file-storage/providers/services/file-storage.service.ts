import fs from "node:fs/promises";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileStorageService {
  // Storage base path for docker volumes
  private readonly BasePath: string;

  constructor(private readonly configService: ConfigService) {
    this.BasePath = this.configService.getOrThrow("STORAGE_ROOT");
  }

  private getFilePath(filePath: string) {
    return path.join(this.BasePath, filePath);
  }

  save(filePath: string, fileToSavePath: string): Promise<boolean>;
  save(filePath: string, buffer: Buffer | string): Promise<boolean> {
    return fs
      .writeFile(this.getFilePath(filePath), buffer)
      .then(() => true)
      .catch(() => false);
  }

  async delete(filePath: string) {
    await fs.rm(this.getFilePath(filePath), { force: true, recursive: true });
  }

  async getFullPath(filePath: string) {
    return this.getFilePath(filePath);
  }
}
