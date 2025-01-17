import { Address } from "modules/addresses";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentSubject {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@OneToOne(() => Address, { eager: true, cascade: true })
	@JoinColumn()
	address: Address;

	// Other data
	@Column({ nullable: true })
	cin: string | null;

	@Column({ nullable: true })
	vatId: string | null;

	@CreateDateColumn()
	createdAt: Date;

	constructor(init?: Partial<PaymentSubject>) {
		Object.assign(this, init);
	}
}
