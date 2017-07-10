import mongoose = require("mongoose")
import { Schema,Model,model } from "mongoose";
import { IUser } from "../interfaces/user";
;

import { IUserModel } from "../models/user";

export var UserSchema: Schema = new Schema({
  name: String
});

export const User: Model<IUserModel> = mongoose.model<IUserModel>("User", UserSchema);

