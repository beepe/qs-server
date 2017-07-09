import { Schema,Model,model } from "mongoose";
import { IMatch } from "../interfaces/match";

import { IMatchModel } from "../models/match";

export var MatchSchema: Schema = new Schema({
  createdAt: Date,
  homeTeam: String,
  awayTeam: String,
  startTime: Date,
  quotes: [Number],
  result: Number,
  playStatus: Number,
  round: Number
});

MatchSchema.pre("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});

export const Match: Model<IMatchModel> = model<IMatchModel>("Match", MatchSchema);

