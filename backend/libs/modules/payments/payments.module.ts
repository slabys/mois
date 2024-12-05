import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentSubject } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([PaymentSubject])],
})
export class PaymentsModule {}
