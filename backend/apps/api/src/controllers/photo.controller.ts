import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Response,
} from "@nestjs/common";
import { ApiPermanentRedirectResponse, ApiTags } from "@nestjs/swagger";
import { Response as ExpressResponse } from "express";
import { PhotoService } from "modules/photo";

@ApiTags("Photo")
@Controller("photo")
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiPermanentRedirectResponse({ description: "Redirect to photo"})
  @Get(":id")
  async getPhoto(@Param("id", ParseUUIDPipe) photoId: string, @Response() res: ExpressResponse) {
    const photo = await this.photoService.findById(photoId);

    if (!photo) throw new NotFoundException();

    const address = this.photoService.getPublicUrl(photo);
    res.redirect(address);
  }
}
