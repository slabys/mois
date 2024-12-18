import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  StreamableFile,
} from "@nestjs/common";
import { ApiPermanentRedirectResponse, ApiTags } from "@nestjs/swagger";
import { fromBuffer } from "file-type";

import { PhotoService } from "modules/photo";

@ApiTags("Photo")
@Controller("photo")
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiPermanentRedirectResponse({ description: "Redirect to photo" })
  @Get(":id")
  async getPhoto(@Param("id", ParseUUIDPipe) photoId: string) {
    const photo = await this.photoService.findById(photoId);
    if (!photo) throw new NotFoundException();

    const stream = await this.photoService.read(photo).catch(() => {
      throw new NotFoundException();
    });

    // To provide mime type, whole stream must be read (TODO: Save mime type in the future or convert all images to same type)
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const { mime } = await fromBuffer(buffer);

    return new StreamableFile(buffer, { type: mime });
  }
}
