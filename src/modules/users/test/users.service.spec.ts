import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { createUserStub } from './stubs/user.stub';
import { FindAllResponse, PaginateParams } from 'src/types/common.type';
import { User } from '../entities/user.entity';
import { UsersRepository } from '@repositories/users.repository';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  const userRepositoryMock = {
    create: jest.fn().mockResolvedValue(createUserStub()),
    findAllWithSubFields: jest.fn().mockResolvedValue({
      count: 1,
      items: [createUserStub()],
    } as FindAllResponse<User>),
    findOneByCondition: jest.fn(({ email }) => {
      if (email === createUserStub().email) {
        return createUserStub();
      }
      return null;
    }),
    update: jest.fn((id, dto: Partial<User>) => {
      if (id === createUserStub()._id) {
        return { ...createUserStub(), dto };
      } else {
        throw new NotFoundException();
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UsersRepositoryInterface', useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>('UsersRepositoryInterface');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new user if data given valid', async () => {
      // Arrange
      const { _id, ...user_stub } = createUserStub();
      jest.spyOn(repository, 'create');

      // Act
      const result = await service.create(user_stub);

      // Assert
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual({
        ...user_stub,
        _id,
      });
    });
  });

  describe('findAll', () => {
    it('should return list of user base on filter', async () => {
      // Arrange
      const options: PaginateParams = { offset: 0, limit: 4 };
      jest.spyOn(repository, 'findAllWithSubFields');

      // Act
      const result = await service.findAll({}, options);

      // Assert
      expect(repository.findAllWithSubFields).toHaveBeenCalled();
      expect(result).toEqual({
        count: 1,
        items: [createUserStub()],
      } as FindAllResponse<User>);
    });
  });

  describe('getUserByEmail', () => {
    it('should return detail of user base on email', async () => {
      // Arrange
      const { email } = createUserStub();
      jest.spyOn(repository, 'findOneByCondition');

      // Act
      const result = await service.getUserByEmail(email);

      // Assert
      expect(repository.findOneByCondition).toHaveBeenCalled();
      expect(result).toEqual(createUserStub());
    });

    it('should throw not found exception if pass wrong email', async () => {
      // Arrange
      const wrong_email = 'wrong@email.com';

      // Act, Arrange
      await expect(service.getUserByEmail(wrong_email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('setCurrentRefreshToken', () => {
    it('should set success new refresh token', async () => {
      // Arrange
      const { _id } = createUserStub();
      const hashed_token = 'hashed_token';
      jest.spyOn(repository, 'update');

      // Act
      await service.setCurrentRefreshToken(_id as string, hashed_token);

      // Assert
      expect(repository.update).toHaveBeenCalled();
    });

    it('should throw new error if pass a wrong user id', async () => {
      // Arrange
      const wrong_user_id = 'wrongUserId';
      const hashed_token = 'hashed_token';

      // Act, Assert

      await expect(
        service.setCurrentRefreshToken(wrong_user_id, hashed_token),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
