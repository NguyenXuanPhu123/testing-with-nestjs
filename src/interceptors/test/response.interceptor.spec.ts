import { CallHandler } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { execution_context } from '../../shared/test/mocks/execution-context.mock';
import { ResponseInterceptor } from '../response.interceptor';

const return_data = { foo: 'bar' };

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let next: CallHandler;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
    // create the mock CallHandler for the interceptor
    next = {
      handle: jest.fn(() => of(return_data)),
    } as CallHandler;
  });

  describe('intercept', () => {
    it('should transform the response data', (done) => {
      // Arrange
      const expected_data = {
        code: 200,
        message: 'Success',
        data: return_data,
      };

      const response_interceptor: Observable<any> = interceptor.intercept(
        execution_context,
        next,
      );
      response_interceptor.subscribe({
        next: (data) => {
          expect(data).toEqual(expected_data);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          done();
        },
      });
    });
    it('should handle errors thrown by the handler', (done) => {
      // Arrange
      const error = new Error('Something went wrong');
      (next.handle as jest.Mock).mockImplementationOnce(() => {
        return throwError(() => error);
      });

      // Act
      const response_interceptor: Observable<any> = interceptor.intercept(
        execution_context,
        next,
      );

      // Assert
      response_interceptor.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
        complete: () => {
          done();
        },
      });
    });
  });
});
