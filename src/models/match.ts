import { Document } from "mongoose";
import { IMatch } from "../interfaces/match";

export interface IMatchModel extends IMatch, Document {
  //custom methods for your model would be defined here
}