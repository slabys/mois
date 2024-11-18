import fs from "node:fs/promises";
import path from "node:path";
import { Injectable, Logger } from "@nestjs/common";
// biome-ignore lint/style/useImportType: BiomeJS, must be value, not type
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  // Storage base path for docker volumes
  private readonly BasePath: string;
  private readonly BaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.BasePath = this.configService.getOrThrow("STORAGE_ROOT");
    this.BaseUrl = this.configService.getOrThrow("BASE_URL");

    const fullBasePath = path.join(process.cwd(), this.BasePath);
    fs.mkdir(fullBasePath, { recursive: true });

    this.logger.log(`Storage is located at: ${fullBasePath}`);
  }

  /**
   * Constructs the absolute file path based on the base storage path.
   * @param filePath - Relative file path
   * @returns Full file path resolved against the base path
   */
  private getFilePath(filePath: string) {
    return path.join(process.cwd(), this.BasePath, filePath);
  }

  /**
   * Saves a file to the specified path.
   * @param filePath - Destination path where the file will be stored
   * @param buffer - Data to save (Buffer or string)
   * @returns Promise resolving to a boolean indicating success or failure
   */
  async save(
    filePath: string,
    buffer: Buffer | string
  ): Promise<string | null> {
    const fullFilePath = this.getFilePath(filePath);
    const dirname = path.dirname(fullFilePath);
    await fs.mkdir(dirname, { recursive: true });

    return fs
      .writeFile(fullFilePath, buffer)
      .then(() => filePath)
      .catch(() => null);
  }

  /**
   * Deletes a file or directory at the specified path.
   * @param filePath - Path to the file or directory to delete
   * @returns Promise that resolves when the operation is complete
   */
  async delete(filePath: string) {
    await fs.rm(this.getFilePath(filePath), { force: true, recursive: true });
  }

  /**
   * Gets the full file path resolved against the base storage path.
   * @param filePath - Relative file path
   * @returns Promise that resolves to the absolute path
   */
  async getFullPath(filePath: string) {
    return this.getFilePath(filePath);
  }

  getPublicUrl(filePath: string) {
    return `${this.BaseUrl}/${path.join(this.BasePath, filePath)}`;
  }
}
