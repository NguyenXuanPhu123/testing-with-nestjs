import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseServiceAbstract } from '../../services/base/base.abstract.service';
import { User } from './entities/user.entity';
import { UsersRepositoryInterface } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllResponse } from 'src/types/common.type';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly users_repository: UsersRepositoryInterface,
  ) {
    super(users_repository);
  }

  async create(create_dto: CreateUserDto): Promise<User> {
    const user = await this.users_repository.create({
      ...create_dto,
    });
    return user;
  }

  async findAll(
    filter?: object,
    options?: object,
  ): Promise<FindAllResponse<User>> {
    return await this.users_repository.findAllWithSubFields(filter, {
      ...options,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.users_repository.findOneByCondition({ email });
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async setCurrentRefreshToken(
    id: string,
    hashed_token: string,
  ): Promise<void> {
    try {
      await this.users_repository.update(id, {
        current_refresh_token: hashed_token,
      });
    } catch (error) {
      throw error;
    }
  }
}
