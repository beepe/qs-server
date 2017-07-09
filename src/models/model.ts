import { Model,model } from "mongoose";
import { IMatchModel } from "./match";

export interface IModel {
  match: Model<IMatchModel>;
}

