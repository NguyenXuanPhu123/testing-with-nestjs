import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { createUserStub } from '../src/modules/users/test/stubs/user.stub';
import {
  mock_access_token,
  mock_refresh_token,
} from '../src/modules/auth/test/mocks/tokens.mock';

jest.mock('../src/modules/auth/auth.service');
jest.mock('../src/modules/users/users.service');
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UsersService, AuthService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth module', () => {
    it('/sign-up (POST)', () => {
      const { first_name, last_name, email, password } = createUserStub();
      return request(app.getHttpServer())
        .post('/sign-up')
        .send({
          first_name,
          last_name,
          email,
          password,
        })
        .expect(201)
        .expect({
          access_token: mock_access_token,
          refresh_token: mock_refresh_token,
        });
    });

    it('/sign-in (POST)', () => {
      const { email, password } = createUserStub();
      return request(app.getHttpServer())
        .post('/sign-in')
        .send({
          email,
          password,
        })
        .expect(201)
        .expect({
          access_token: mock_access_token,
          refresh_token: mock_refresh_token,
        });
    });

    it('/refresh (POST)', () => {
      const { current_refresh_token } = createUserStub();
      return request(app.getHttpServer())
        .post('/refresh')
        .send({
          current_refresh_token,
        })
        .expect(201)
        .expect(mock_access_token);
    });
  });

  describe('User module', () => {
    it('/ (POST)', () => {
      const { first_name, last_name, email, password } = createUserStub();
      return request(app.getHttpServer())
        .post('/')
        .send({ first_name, last_name, email, password })
        .expect(201)
        .expect(createUserStub());
    });

    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .send({ offset: 4, limit: 10 })
        .expect(201)
        .expect([createUserStub()]);
    });

    it('/:id (GET)', () => {
      const { _id } = createUserStub();
      return request(app.getHttpServer())
        .get(`/${_id.toString()}`)
        .send(_id.toString())
        .expect(201)
        .expect(createUserStub());
    });

    it('/:id (PATCH)', () => {
      const { _id, first_name } = createUserStub();
      return request(app.getHttpServer())
        .patch(`/${_id.toString()}`)
        .send({ id: _id.toString(), update_user_dto: { first_name } })
        .expect(201)
        .expect(createUserStub());
    });

    it('/:id (DELETE)', () => {
      const { _id } = createUserStub();
      return request(app.getHttpServer())
        .delete(`/${_id.toString()}`)
        .expect(201);
    });
  });
});
