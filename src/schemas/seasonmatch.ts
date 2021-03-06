import mongoose = require("mongoose")
import { Schema,Model,model } from "mongoose";
import { ISeasonMatch } from "../interfaces/seasonmatch";
import { ISeasonMatchModel } from "../models/seasonmatch";
import * as Q from "q";

export var SeasonMatchSchema: Schema = new Schema({
  createdAt: {type: Date, default: Date.now },
  league: String,
  user: {  name: String } ,
  tipMatches: [{ match: {type: Schema.Types.ObjectId, ref: 'Match'}, prediction: Number, yield: Number, correct: Boolean }],
  season: String,  // replace with season object
  homeAway: Number,  // 1-home, 2-away, 0-neutral
  status: Number, // 1-untouched, 2-saved, 3-intermediary, 4-finalized 
  goals: {self:Number, other:Number},
  points: {self:Number, other:Number},
  adversary: {type: Schema.Types.ObjectId, ref: 'SeasonMatch'}
});

export const SeasonMatch: Model<ISeasonMatchModel> = getModel()



function getModel(): Model<ISeasonMatchModel>  {
 
  // Check to see if the model has been registered with mongoose
  // if it exists return that model
  if ( mongoose.modelNames().indexOf("SeasonMatch") > -1 ) return mongoose.model("SeasonMatch");
  // if no current model exists register and return new model
  return  mongoose.model<ISeasonMatchModel>("SeasonMatch", SeasonMatchSchema);
}


