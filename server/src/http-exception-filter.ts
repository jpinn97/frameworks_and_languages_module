import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = exception.getStatus();

    // Convert 400 Bad Request to 405 Method Not Allowed
    if (status === HttpStatus.BAD_REQUEST) {
      response
        .status(HttpStatus.METHOD_NOT_ALLOWED)
        .json({
          statusCode: HttpStatus.METHOD_NOT_ALLOWED,
          message: 'Method Not Allowed',
        });
    } else {
      // Handle other exceptions normally
      response
        .status(status)
        .json(exception.getResponse());
    }
  }
}
