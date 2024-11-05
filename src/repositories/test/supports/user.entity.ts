import { User } from '../../../modules/users/entities/user.entity';
import { BaseMockEntity } from './base-mock.entity';
import { createUserStub } from '../../../modules/users/test/stubs/user.stub';
export class UserEntity extends BaseMockEntity<User> {
  protected entity_stub = createUserStub();
}
