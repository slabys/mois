import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmail } from "class-validator";
import { User } from "modules/users/entities";
import { FindOptionsRelations, FindOptionsWhere, In, Repository } from "typeorm";
import { PaginationOptions } from "utilities/nest/decorators";

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
	findByEmaiWithPassword(email: User["email"]): Promise<User | null> {
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
	findByUsernameWithPasword(username: User["username"]): Promise<User | null> {
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
			? this.findByEmaiWithPassword(usernameOrEmail)
			: this.findByUsernameWithPasword(usernameOrEmail);
	}

	/**
	 * Find all users ordered by lastName
	 * @param options Find options
	 * @returns
	 */
	find(options: { pagination: PaginationOptions }) {
		return this.UsersRepository.find({
			take: options.pagination.take,
			skip: options.pagination.skip,
			order: {
				lastName: "ASC",
			},
		});
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
