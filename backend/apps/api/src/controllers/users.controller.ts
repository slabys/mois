import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from "@nestjs/swagger";
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";

import { OrganizationService } from "modules/organization";
import { PhotoService } from "modules/photo";
import { User, UsersService } from "modules/users";

import { CookieGuard } from "modules/auth/providers/guards";
import { CurrentUser } from "../decorators";
import { CreateUser, UpdatePhoto, UpdateUser } from "../models/requests";
import { OrganizationMemberWithoutUser } from "../models/responses";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly photoService: PhotoService,
    private readonly organizationService: OrganizationService
  ) {}

  @ApiConflictResponse({ description: "User with email already exist" })
  @ApiCreatedResponse({ type: User, description: "User has been created" })
  @ApiBadRequestResponse({
    description:
      "Invalid university ID given or payload did not pass validation",
  })
  @Post()
  async createUser(@Body() body: CreateUser) {
    const user = await this.usersService.findByEmailWithPassword(body.email);
    if (user) throw new ConflictException();

    let newUser = new User({
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      username: body.username,
    });

    newUser = await this.usersService.save(newUser);
    newUser.password = undefined;
    return newUser;
  }

  @ApiCookieAuth()
  @UseGuards(CookieGuard)
  @Patch()
  async updateCurrentUser(@Body() body: UpdateUser, @CurrentUser() user: User) {
    // For safety reasons set each property individually
    user.password = body.password ?? user.password;
    user.firstName = body.firstName ?? user.firstName;
    user.lastName = body.lastName ?? user.lastName;
    user.username = body.username ?? user.username;

    return this.usersService.save(user);
  }

  @ApiOkResponse({ type: User, description: "Current user data" })
  @ApiCookieAuth()
  @UseGuards(CookieGuard)
  @Get()
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @ApiConsumes("multipart/form-data")
  @FormDataRequest({ storage: MemoryStoredFile })
  @ApiCookieAuth()
  @UseGuards(CookieGuard)
  @Patch("photo")
  async updateCurrentUserPhoto(
    @CurrentUser() user: User,
    @Body() body: UpdatePhoto
  ) {
    const photo = await this.photoService.save(body.file.buffer, "user_photo");
    if (!photo) throw new InternalServerErrorException();

    user.photo = photo;
    return this.usersService.save(user);
  }

  @ApiOkResponse({
    type: [OrganizationMemberWithoutUser],
    description: "All organizations where user is member of",
  })
  @ApiCookieAuth()
  @UseGuards(CookieGuard)
  @Get(":id/organizations")
  userOrganizationMemberships(@Param("id", ParseUUIDPipe) userId: string) {
    return this.organizationService.findUserMemberships(userId);
  }
}
