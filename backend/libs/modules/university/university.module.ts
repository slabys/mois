import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { University } from "./entities";
import { UniversityService } from "./providers/services";

@Module({
  imports: [TypeOrmModule.forFeature([University])],
  providers: [UniversityService],
  exports: [UniversityService],
})
export class UniversityModule {}
