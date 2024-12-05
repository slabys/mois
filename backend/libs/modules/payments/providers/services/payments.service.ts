import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PaymentSubject } from "../../entities";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentSubject)
    private readonly paymentSubjectRepository: Repository<PaymentSubject>
  ) {}
}
