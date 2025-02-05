import { Address } from "modules/addresses";
import { Organization } from "modules/organization";
import { User } from "modules/users";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	type DeepPartial,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { EventCustomOrganization } from "./event-custom-organization.entity";
import { EventSpot } from "./event-spot.entity";
import { Event } from "./event.entity";
import { Invoice } from "modules/invoice/entities";
import { InvoiceMethods } from "modules/events/invoice-methods";

/**
 * Event application represents registration to event
 *
 * Important things before save or update:
 * - Organization or customOrganization must be set
 *
 */
@Unique(["user", "event"])
@Entity()
export class EventApplication extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
	user: User;

	@ManyToOne(
		() => Event,
		(event) => event.applications,
		{
			nullable: false,
			onDelete: "CASCADE",
		},
	)
	event: Event;

	@ManyToOne(() => Organization, { nullable: true })
	organization: Organization;

	@OneToOne(
		() => EventCustomOrganization,
		(organization) => organization.application,
		{ cascade: true },
	)
	customOrganization: EventCustomOrganization;

	/**
	 * Spot, must be one of {@link event} spots
	 */
	@ManyToOne(() => EventSpot, {
		nullable: true,
		onDelete: "SET NULL",
		eager: true,
	})
	spotType: EventSpot | null;

	@Column({ type: "json", default: {}, select: false })
	additionalData: object;

	@OneToOne(() => Address, { cascade: true })
	@JoinColumn()
	personalAddress: Address;

	@Column({ type: "enum", enum: InvoiceMethods, default: InvoiceMethods.personal, enumName: "InvoiceMethods" })
	invoiceMethod: InvoiceMethods;

	@OneToOne(() => Address, { cascade: true })
	@JoinColumn()
	invoiceAddress: Address;

	@Column({ select: false })
	idNumber: string;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => Invoice, { nullable: true })
	invoice: Invoice;

	constructor(initial?: DeepPartial<EventApplication>) {
		super();
		Object.assign(this, initial);
	}
}
