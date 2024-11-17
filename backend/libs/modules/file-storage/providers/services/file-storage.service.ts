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

  /**
   * Constructs the absolute file path based on the base storage path.
   * @param filePath - Relative file path
   * @returns Full file path resolved against the base path
   */
  private getFilePath(filePath: string) {
    return path.join(this.BasePath, filePath);
  }

  /**
   * Saves a file to the specified path.
   * This method overload supports saving a file from a source path or from a buffer.
   * @param filePath - Destination path where the file will be stored
   * @param fileToSavePath - Path to the file being saved
   * @returns Promise resolving to a boolean indicating success or failure
   */
  save(filePath: string, fileToSavePath: string): Promise<boolean>;
  /**
   * Saves a file to the specified path.
   * @param filePath - Destination path where the file will be stored
   * @param buffer - Data to save (Buffer or string)
   * @returns Promise resolving to a boolean indicating success or failure
   */
  async save(filePath: string, buffer: Buffer | string): Promise<boolean> {
    const dirname = path.dirname(filePath);
    await fs.mkdir(dirname, { recursive: true });

    return fs
      .writeFile(this.getFilePath(filePath), buffer)
      .then(() => true)
      .catch(() => false);
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
}
