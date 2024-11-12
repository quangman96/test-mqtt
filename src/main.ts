import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the microservice
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    });
  microservice.listen().then(() => console.log('Microservice is listening...'));

  // Create the HTTP server
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, () =>
    console.log('HTTP server is listening on port 3000...'),
  );
}

bootstrap();
