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

