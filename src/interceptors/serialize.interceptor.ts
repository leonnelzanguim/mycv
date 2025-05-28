import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serialize<T>(dto: Type<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: Type<T>) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled
    // by the request handler
    //console.log('Im running before the handler', context);

    return handler.handle().pipe(
      map((data: T) => {
        // Run something before the response is sent out
        //console.log('Im running before response is sent out', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
