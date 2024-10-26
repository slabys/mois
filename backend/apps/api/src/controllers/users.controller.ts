import {
  Body,
  ConflictException,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { JwtGuard } from "modules/auth/providers/guards";
import { User, UsersService } from "modules/users";

import { CurrentUser } from "../decorators";
import { CreateUser, UpdateUser } from "../models/requests";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConflictResponse({ description: "User with email already exist" })
  @ApiCreatedResponse({ type: User, description: "User has been created" })
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

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
