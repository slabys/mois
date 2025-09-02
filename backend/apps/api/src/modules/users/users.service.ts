import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmail } from "class-validator";
import { User } from "./entities";
import { FindOptionsRelations, FindOptionsWhere, In, Repository } from "typeorm";
import type { PaginationOptions } from "utilities/nest/decorators";
import { formatPaginatedResponse } from "utilities/pagination.helper";

type UserId = User["id"];

interface FindUserOptions {
	relations?: FindOptionsRelations<User>;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly UsersRepository: Repository<User>,
	) {}

	/**
	 * Save user entity
	 * @param user
	 * @returns
	 */
	save(user: User) {
		return this.UsersRepository.save(user);
	}

	/**
	 * Find user by ID
	 * @param id ID
	 * @param options
	 * @returns
	 */
	findById(id: UserId, options?: FindUserOptions) {
		return this.UsersRepository.findOne({
			where: { id },
			relations: options?.relations,
		});
	}

	/**
	 * Find many users by IDs
	 * @param ids IDs
	 * @param options Find options
	 * @returns
	 */
	findManyById(ids: string[], options?: FindUserOptions) {
		return this.UsersRepository.find({
			where: { id: In(ids) },
			relations: options?.relations,
		});
	}

	/**
	 * Find user by email and select password column
	 * @param email User email
	 * @returns
	 */
	findByEmailWithPassword(email: User["email"]): Promise<User | null> {
		return this.UsersRepository.createQueryBuilder("user")
			.addSelect("user.password")
			.where("user.email = :email", { email })
			.getOne();
	}

	/**
	 * Find user by username and select password column
	 * @param username User username
	 * @returns
	 */
	findByUsernameWithPassword(username: User["username"]): Promise<User | null> {
		return this.UsersRepository.createQueryBuilder("user")
			.addSelect("user.password")
			.where("user.username = :username", { username })
			.getOne();
	}

	/**
	 * Find user by username or password
	 *
	 * Is shorthand to `findByEmaiWithPassword` and `findByUsernameWithPasword` by checking if value is email or username
	 * @param usernameOrEmail
	 * @returns
	 */
	findByUsernameOrEmailWithPassword(usernameOrEmail: string) {
		return isEmail(usernameOrEmail)
			? this.findByEmailWithPassword(usernameOrEmail)
			: this.findByUsernameWithPassword(usernameOrEmail);
	}

	/**
	 * Find all users ordered by lastName
	 * @returns FormatPaginatedResponseType<User[]>
	 */
	async find(pagination?: PaginationOptions, options?: FindUserOptions) {
		const [users, totalCount] = await this.UsersRepository.findAndCount({
			order: { createdAt: "ASC" },
			relations: {
				...options?.relations,
			},
			take: pagination.all ? undefined : pagination.perPage,
			skip: pagination.all ? undefined : (pagination.page - 1) * pagination.perPage,
		});

		return formatPaginatedResponse<User>(users, totalCount, pagination);
	}

	/**
	 * Checks if user with specific criterial already exist
	 * Is better to index criteria columns
	 * @param criteria Criteria
	 * @returns
	 */
	exist(criteria: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
		return this.UsersRepository.existsBy(criteria);
	}
}
