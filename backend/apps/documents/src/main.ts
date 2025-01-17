import { NestFactory } from "@nestjs/core";
import { DocumentsModule } from "./documents.module";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";

async function bootstrap() {
	ConfigModule.forRoot();
	const configService = new ConfigService();

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(DocumentsModule, {
		transport: Transport.REDIS,
		options: {
			host: configService.getOrThrow("REDIS_HOST"),
			username: configService.get("REDIS_USERNAME"),
			password: configService.get("REDIS_PASSWORD"),
			db: configService.get("REDIS_DB") ?? 0,
			port: configService.get("REDIS_PORT"),
		},
	});

	await app.init();
	await app.listen();
}
bootstrap();
