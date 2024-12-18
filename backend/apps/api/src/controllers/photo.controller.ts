import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  StreamableFile,
} from "@nestjs/common";
import { ApiPermanentRedirectResponse, ApiTags } from "@nestjs/swagger";
import { fileTypeFromStream } from "file-type";

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

    const stream = await this.photoService.read(photo);
    const { mime } = await fileTypeFromStream(stream);

    return new StreamableFile(stream, { type: mime });
  }
}
