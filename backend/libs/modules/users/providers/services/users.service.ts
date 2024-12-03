import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isEmail } from "class-validator";
import { User } from "modules/users/entities";
import { FindOptionsWhere, Repository } from "typeorm";

type UserId = User["id"];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly UsersRepository: Repository<User>
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
  findById(id: UserId) {
    return this.UsersRepository.findOneBy({ id });
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
   * Checks if user with specific criterial already exist
   * Is better to index criteria columns
   * @param criteria Criteria
   * @returns
   */
  exist(criteria: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.UsersRepository.existsBy(criteria);
  }
}
