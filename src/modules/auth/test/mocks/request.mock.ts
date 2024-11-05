import { createUserStub } from '../../../users/test/stubs/user.stub';
import { RequestWithUser } from 'src/types/request.type';

export const mock_request_with_user = {
  user: createUserStub(),
} as RequestWithUser;
