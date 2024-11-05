import { GENDER, User } from '../../../users/entities/user.entity';

export const createUserStub = (): User => {
  return {
    _id: '643d0fb80a2f99f4151176c4',
    email: 'johndoe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    password: 'strongestP@ssword',
    username: 'johndoe',
    gender: GENDER.MALE,
  };
};
