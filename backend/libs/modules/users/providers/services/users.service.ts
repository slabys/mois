import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "modules/users/entities";
import { Repository } from "typeorm";

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
   * Find user by email
   * @param email User email
   * @returns
   */
  findByEmailWithPassword(email: User["email"]): Promise<User | null> {
    return this.UsersRepository.createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
  }
}
