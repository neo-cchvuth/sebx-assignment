import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findOne(username: string) {
    return this.userModel
      .findOne({
        username,
      })
      .exec();
  }
}
