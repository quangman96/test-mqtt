import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('MQTT_TRANSPORT') private transport: ClientProxy) {}

  @Get('hello')
  getHello() {
    return this.transport.emit('test/topic', {
      message: 'Hello from the other side!',
    });
  }

  @MessagePattern('test/topic')
  getNotifications(
    @Payload() data: { message: string },
    @Ctx() context: MqttContext,
  ) {
    console.log(`Topic: ${context.getTopic()}`);
    console.log(`Message: ${data.message}`);
  }
}
