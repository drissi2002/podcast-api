/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateEntryException extends HttpException {
  constructor(value: string) {
    super(
      {
        success: false,
        statusCode: HttpStatus.CONFLICT,
        error: 'Duplicate Entry',
        message: `The value of '${value}' is already in use. Please choose another.`
     },
      HttpStatus.CONFLICT,
    );
  }
}
