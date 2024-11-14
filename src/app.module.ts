import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { MqttService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'MQTT_TRANSPORT',
      useFactory: () =>
        ClientProxyFactory.create({
        transport: Transport.MQTT,
          options: {
            url: 'mqtt://localhost:1883',
          },
        }),
    },
    MqttService
  ],
})
export class AppModule {}
