import { ApiProperty } from '@nestjs/swagger';
import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorResponse {
  @ApiProperty({
    type: () => ErrorMessage,
    isArray: true,
    example: [
      {
        message: 'string',
        field: 'string',
      },
    ],
  })
  errorMessages: ErrorMessage[];
}

export class ErrorMessage {
  @ApiProperty({ example: 'string' })
  message: string;
  @ApiProperty({ example: 'string' })
  field: string | null;

  constructor(message: string, field: string | null = null) {
    this.message = message;
    this.field = field;
  }
}

export class DomainException extends Error {
  constructor(
    public message: string,
    public code: DomainExceptionCode,
    public extensions: ErrorMessage[],
  ) {
    super(message);
  }
}

function ConcreteDomainExceptionFactory(
  commonMessage: string,
  code: DomainExceptionCode,
) {
  return class extends DomainException {
    constructor(extensions: ErrorMessage[]) {
      super(commonMessage, code, extensions);
    }
    // static create(message?: string, key?: string) {
    //   return new this(message ? [new ErrorMessage(message, key)] : []);
    // }
    static create(
      messageOrErrorObj?: string | { field: string; message: string },
      key?: string,
    ) {
      if (typeof messageOrErrorObj === 'object' && messageOrErrorObj !== null) {
        return new this([
          new ErrorMessage(messageOrErrorObj.message, messageOrErrorObj.field),
        ]);
      }
      return new this(
        messageOrErrorObj
          ? [new ErrorMessage(messageOrErrorObj as string, key)]
          : [],
      );
    }

    static createWithArray(extensions: ErrorMessage[]) {
      return new this(extensions);
    }
  };
}

export const NotFoundDomainException = ConcreteDomainExceptionFactory(
  'Not Found',
  DomainExceptionCode.NotFound,
);

export const BadRequestDomainException = ConcreteDomainExceptionFactory(
  'BadRequest',
  DomainExceptionCode.BadRequest,
);

export const ForbiddenDomainException = ConcreteDomainExceptionFactory(
  'Forbidden',
  DomainExceptionCode.Forbidden,
);

export const UnauthorizedDomainException = ConcreteDomainExceptionFactory(
  'Unauthorized',
  DomainExceptionCode.Unauthorized,
);

export const TooManyRequestsDomainException = ConcreteDomainExceptionFactory(
  'TooManyRequests',
  DomainExceptionCode.TooManyRequests,
);
