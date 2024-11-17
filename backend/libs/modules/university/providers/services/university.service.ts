import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { University } from "modules/university/entities";
import { Repository } from "typeorm";

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>
  ) {}

  /**
   * Find university by ID
   * @param id ID
   * @returns {University | null} University or null
   */
  findById(id: University["id"]) {
    return this.universityRepository.findOneBy({ id });
  }

  /**
   * Find all universitites
   * @returns {University[]}
   */
  findAll() {
    return this.universityRepository.find({
      order: {
        name: "ASC",
      },
    });
  }
}
