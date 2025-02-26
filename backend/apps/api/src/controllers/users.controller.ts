import {
	BadRequestException,
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
	ApiBearerAuth,
	ApiConsumes,
	ApiCreatedResponse,
	ApiExtraModels,
	ApiOkResponse,
	ApiTags,
	getSchemaPath,
} from "@nestjs/swagger";
import { FormDataRequest, MemoryStoredFile } from "nestjs-form-data";

import { OrganizationService } from "modules/organization";
import { PhotoService } from "modules/photo";
import { User, UsersService } from "modules/users";

import { CookieGuard } from "modules/auth/providers/guards";
import { CurrentUser } from "../decorators";
import { CreateUser, UpdatePhoto, UpdateUser } from "../models/requests";
import { OrganizationMemberWithoutUser } from "../models/responses";
import { Address } from "modules/addresses";
import { Pagination, PaginationOptions } from "utilities/nest/decorators";
import { PaginationDto, PaginationResponseDto } from "../models/responses/pagination-response.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly photoService: PhotoService,
		private readonly organizationService: OrganizationService,
	) {
	}

	@ApiCreatedResponse({ type: User, description: "User has been created" })
	@Post()
	async createUser(@Body() body: CreateUser) {
		const exist = await this.usersService.exist([{ email: body.email }, { username: body.username }]);
		if (exist) throw new ConflictException("User with email or username already exist");

		let newUser = new User({
			email: body.email,
			password: body.password,
			firstName: body.firstName,
			lastName: body.lastName,
			username: body.username,
			gender: body.gender,
		});

		if (body.personalAddress) {
			const { personalAddress: address } = body;
			newUser.personalAddress = new Address({
				city: address.city,
				country: address.country,
				houseNumber: address.houseNumber,
				street: address.street,
				zip: address.zip,
			});
		}

		newUser = await this.usersService.save(newUser);
		newUser.password = undefined;
		return newUser;
	}

	/**
	 * Update user data
	 */
	@ApiBadRequestResponse({ description: "Username is already taken" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Patch()
	async updateCurrentUser(@Body() body: UpdateUser, @CurrentUser() requestUser: User) {
		if (body.username && body.username !== requestUser.username) {
			const exists = await this.usersService.exist({ username: body.username });
			if (exists) throw new BadRequestException("Username is already taken");
		}

		const user = await this.usersService.findById(requestUser.id, {
			relations: { personalAddress: true },
		});

		// For safety reasons set each property individually
		user.password = body.password ?? user.password;
		user.firstName = body.firstName ?? user.firstName;
		user.lastName = body.lastName ?? user.lastName;
		user.username = body.username ?? user.username;
		user.gender = body.gender ?? user.gender;

		if (body.personalAddress) {
			if (user.personalAddress) user.personalAddress.update(body.personalAddress);
			else user.personalAddress = new Address(body.personalAddress);
		}

		const newUser = await this.usersService.save(user);
		newUser.password = undefined;
		return newUser;
	}

	@ApiOkResponse({ type: User, description: "Current user data" })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Get()
	async getCurrentUser(@CurrentUser() user: User) {
		return this.usersService.findById(user.id, {
			relations: { photo: true, personalAddress: true },
		});
	}

	@ApiConsumes("multipart/form-data")
	@FormDataRequest({ storage: MemoryStoredFile })
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Patch("photo")
	async updateCurrentUserPhoto(@CurrentUser() user: User, @Body() body: UpdatePhoto) {
		const photo = await this.photoService.save(body.file.buffer, "user_photo");
		if (!photo) throw new InternalServerErrorException();

		user.photo = photo;
		return this.usersService.save(user);
	}

	@ApiOkResponse({
		type: [OrganizationMemberWithoutUser],
		description: "All organizations where user is member of",
	})
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@Get(":id/organizations")
	userOrganizationMemberships(@Param("id", ParseUUIDPipe) userId: string) { //, @Pagination() pagination: PaginationOptions
		return this.organizationService.findUserMemberships(userId);
	}

	/**
	 * Find all users ordered by `lastName`.
	 */
	@ApiBearerAuth()
	@UseGuards(CookieGuard)
	@ApiExtraModels(User, PaginationResponseDto<User>)
	@ApiOkResponse({
		description: "Get all users",
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: { $ref: getSchemaPath(User) },
						},
						pagination: { $ref: getSchemaPath(PaginationDto) },
					},
				},
			},
		},
	})
	@Get("all")
	getAllUsers(@Pagination() pagination?: PaginationOptions) {
		return this.usersService.find(pagination);
	}
}
