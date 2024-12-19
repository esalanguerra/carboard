import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Car Board API")
    .setDescription("The Car Board API description")
    .setVersion("1.0")
    .addTag("cars")
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, documentFactory);

  app.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }

        return compression.filter(req, res);
      },
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
