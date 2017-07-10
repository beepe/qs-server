import { Document } from "mongoose";
import { ISeasonMatch } from "../interfaces/seasonmatch";

export interface ISeasonMatchModel extends ISeasonMatch, Document {
  //custom methods for your model would be defined here
}