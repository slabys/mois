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
import { User, UsersService } from "modules/users";
import { CreateUser, UpdateUser } from "../models/requests";
import { JwtGuard } from "modules/auth/providers/guards";
import { CurrentUser } from "../decorators";

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
    });
    newUser = await this.usersService.save(newUser);
    newUser.password = undefined;
    return newUser;
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch()
  async updateCurrentUser(@Body() body: UpdateUser, @CurrentUser() user: User) {
    user.password = body.password;
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
