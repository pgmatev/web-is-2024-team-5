import { IUser } from '../models/UserModel';
import _ from 'lodash';

export function transformUser(user: IUser) {
  const { _id, __v, password, ...userWithoutSensitiveInfo } = user;

  const transformedUser = {
    id: _id,
    ...userWithoutSensitiveInfo,
  };

  return transformedUser;
}
