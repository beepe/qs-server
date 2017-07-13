import mongoose = require("mongoose")
import { Schema,Model,model } from "mongoose";
import { IMatch } from "../interfaces/match";
;

import { IMatchModel } from "../models/match";

export var MatchSchema: Schema = new Schema({
  createdAt: {type: Date, default: Date.now },
  homeTeam: String,
  awayTeam: String,
  startTime: Date,
  quotes: [Number],
  result: Number,
  playStatus: Number,
  round: Number,
  domain: String
});

export const Match: Model<IMatchModel> = mongoose.model<IMatchModel>("Match", MatchSchema);

export const SeasonMatch: Model<IMatchModel> = getModel()



function getModel(): Model<IMatchModel>  {
 
  // Check to see if the model has been registered with mongoose
  // if it exists return that model
  if ( mongoose.modelNames().indexOf("Match") > -1 ) return mongoose.model("Match");
  // if no current model exists register and return new model
  return  mongoose.model<IMatchModel>("Match", MatchSchema);
}
