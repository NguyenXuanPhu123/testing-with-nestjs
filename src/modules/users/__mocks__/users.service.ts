import { NotFoundException } from '@nestjs/common';
import { createUserStub } from '../test/stubs/user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getUserByEmail: jest.fn().mockResolvedValue(createUserStub()),
  getUserWithRole: jest.fn().mockResolvedValue(createUserStub()),
  findOneByCondition: jest.fn().mockResolvedValue(createUserStub()),
  findOne: jest.fn().mockResolvedValue(createUserStub()),
  setCurrentRefreshToken: jest.fn((user_id) => {
    if (user_id === createUserStub()._id) {
      return true;
    } else {
      throw new NotFoundException();
    }
  }),
  findAll: jest.fn().mockResolvedValue([createUserStub()]),
  create: jest.fn().mockResolvedValue(createUserStub()),
  update: jest.fn().mockResolvedValue(createUserStub()),
  remove: jest.fn().mockResolvedValue(true),
});
