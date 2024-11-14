import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { MqttService } from './app.service';

@Controller()
export class AppController {
  constructor(@Inject('MQTT_TRANSPORT') private transport: ClientProxy,
  private mqttService: MqttService) {}

  @Get('hello')
  getHello() {
    return this.mqttService.publishEvent();
    // return this.transport.emit('test/topic', {
    //   message: 'Hello from the other side!',
    // });
  }

  @MessagePattern('/+/test/topic/+')
  getNotifications(
    @Payload() data: { message: string },
    @Ctx() context: MqttContext,
  ) {
    console.log(`Topic: ${context.getTopic()}`);
    console.log(`Message: ${data.message}`);
  }
}
