import { BaseEntity } from '../../shared/base/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum LANGUAGES {
  ENGLISH = 'English',
  FRENCH = 'French',
  JAPANESE = 'Japanese',
  KOREAN = 'Korean',
  SPANISH = 'Spanish',
}
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User extends BaseEntity {
  constructor({
    first_name,
    last_name,
    email,
    username,
    password,
    gender,
  }: {
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    password?: string;
    gender?: GENDER;
  }) {
    super();
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.gender = gender;
  }
  @Prop()
  friendly_id?: number;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (first_name: string) => {
      return first_name.trim();
    },
  })
  first_name: string;

  @Prop({
    required: true,
    minlength: 2,
    maxlength: 60,
    set: (last_name: string) => {
      return last_name.trim();
    },
  })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Exclude()
  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    enum: GENDER,
  })
  gender: GENDER;

  @Prop()
  @Exclude()
  current_refresh_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
