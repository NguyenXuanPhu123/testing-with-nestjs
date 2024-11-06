import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { createUserStub } from './stubs/user.stub';
import { UpdateUserDto } from '../dto/update-user.dto';

jest.mock('../users.service.ts');
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create new user', async () => {
      // Arrange
      const { _id, ...user_stub } = createUserStub();
      jest.spyOn(service, 'create');

      // Act
      const result = await controller.create(user_stub);

      // Assert
      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual({
        ...user_stub,
        _id,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user base on id given', async () => {
      // Arrange
      const { _id } = createUserStub();
      jest.spyOn(service, 'findOne');

      // Act
      const result = await controller.findOne(_id as string);

      // Assert
      expect(service.findOne).toHaveBeenCalled();
      expect(result).toEqual(createUserStub());
    });
  });

  describe('update', () => {
    it('should update user with dto given', async () => {
      // Arrange
      const { _id } = createUserStub();
      jest.spyOn(service, 'update');

      // Act
      const result = await controller.update(
        _id as string,
        {} as UpdateUserDto,
      );

      // Assert
      expect(service.update).toHaveBeenCalled();
      expect(result).toEqual(createUserStub());
    });
  });

  describe('findAll', () => {
    it('should return list all of user', async () => {
      // Arrange
      const offset = 4;
      const limit = 10;

      // Act
      const result = await controller.findAll(offset, limit);

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([createUserStub()]);
    });
  });

  describe('remove', () => {
    it('should remove a user base on userId', async () => {
      // Arrange
      const { _id } = createUserStub();
      const isRemoveSuccess = true;
      jest.spyOn(service, 'remove');

      // Act
      const result = await controller.remove(_id as string);

      // Assert
      expect(service.remove).toHaveBeenCalled();
      expect(result).toEqual(isRemoveSuccess);
    });
  });
});
