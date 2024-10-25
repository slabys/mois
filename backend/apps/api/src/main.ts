import packageJson from "package.json";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";

import { isDevelopment } from "utilities/env";
import { includeSwagger } from "utilities/swagger";
import { AppModule } from "./app.module";
import helmet from "helmet";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	app.use(helmet());

	if (isDevelopment) {
		const config = new DocumentBuilder()
			.setTitle(`${packageJson.name} API`)
			.setDescription(`The ${packageJson.name} API description`)
			.setVersion(packageJson.version)
			.addBearerAuth()
			.build();

		includeSwagger(app, config);
	}

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
