import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  ClientOptions,
} from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { from, Observable, of, throwError } from 'rxjs';
import {
  switchMap,
  tap,
  catchError,
  finalize,
  concatMap,
} from 'rxjs/operators';

@Injectable()
export class MqttService {
  private client: ClientProxy;

  constructor() {}

  private createClientOptions(
    username: string,
    password: string,
    clientId: string,
  ): ClientOptions {
    return {
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://localhost:1883',
      },
    };
  }

  publishEvent(
    username?: string,
    password?: string,
    clientId?: string,
  ): Observable<void> {
    const clientOptions = this.createClientOptions(
      username,
      password,
      clientId,
    );
    this.client = ClientProxyFactory.create(clientOptions);

    const topics = [
      `/${uuidv4()}/test/topic/1`,
      `/${uuidv4()}/test/topic/2`,
      `/${uuidv4()}/test/topic/3`,
    ];
    const message = 'Hello MQTT';

    // return from(this.client.connect()).pipe(
    //   switchMap(() => {
    //     console.log('Connected to MQTT broker');
    //     return this.client.emit<void>(topic, { message });
    //   }),
    //   tap(() => console.log(`Message published to ${topic}`)),
    //   catchError((err) => {
    //     console.error('Publish error:', err);
    //     throw err;
    //   }),
    //   finalize(() => this.client.close()),
    // );

    // return from(this.client.connect()).pipe(
    //   switchMap(() => {
    //     console.log('Connected to MQTT broker');
    //     return from(topics).pipe(
    //       concatMap((topic) =>
    //         this.client
    //           .emit<void>(topic, { message })
    //           .pipe(tap(() => console.log(`Message published to ${topic}`))),
    //       ),
    //     );
    //   }),
    //   catchError((err) => {
    //     console.error('Publish error:', err);
    //     return of(null);
    //   }),
    //   finalize(() => {
    //     console.log('Closing MQTT connection...');
    //     this.client.close();
    //   }),
    // );

    return from(this.client.connect()).pipe(
      switchMap(() => {
        console.log('Connected to MQTT broker');
        return concatMap((topic) =>
          this.client.emit<void>(topic, { message }).pipe(
            tap(() => console.log(`Message published to ${topic}`)),
            catchError((err) => {
              console.error(`Error publishing to ${topic}:`, err);
              return throwError(() => err);
            }),
          ),
        )(from(topics));
      }),
      finalize(() => {
        console.log('Closing MQTT connection');
        this.client.close();
      }),
    );
  }
}
