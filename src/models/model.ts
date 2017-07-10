import { IUserModel } from './user';
import { ISeasonMatchModel } from './seasonmatch';
import { Model,model } from "mongoose";
import { IMatchModel } from "./match";

export interface IModel {
  match: Model<IMatchModel>;
  user: Model<IUserModel>;
  seasonMatch: Model<ISeasonMatchModel>;
}

