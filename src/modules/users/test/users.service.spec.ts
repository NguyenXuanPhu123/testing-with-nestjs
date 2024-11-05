import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { createUserStub } from './stubs/user.stub';
import { FindAllResponse, PaginateParams } from 'src/types/common.type';
import { User } from '../entities/user.entity';
import { UsersRepository } from '@repositories/users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  const userRepositoryMock = {
    create: jest.fn().mockResolvedValue(createUserStub()),
    findAllWithSubFields: jest.fn().mockResolvedValue({
      count: 1,
      items: [createUserStub()],
    } as FindAllResponse<User>),
    findOneByCondition: jest.fn().mockResolvedValue(createUserStub()),
    update: jest.fn((id, dto: Partial<User>) => ({ ...createUserStub(), dto })),
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
  });
});
