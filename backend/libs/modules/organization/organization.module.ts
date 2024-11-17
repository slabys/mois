import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization, OrganizationMember } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationMember])],
})
export class OrganizationModule {}
