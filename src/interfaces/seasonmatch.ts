import { IMatch } from "interfaces/match";
import { IUser } from "interfaces/user";

export interface ISeasonMatch {
  league: string,
  user: IUser,
  tipMatches: { match: IMatch, prediction: number, yield: number, correct: boolean }[],
  season: string,  // replace with season object
  homeAway: number,  // 1-home, 2-away, 0-neutral
  status: number // 1-untouched, 2-saved, 3-intermediary, 4-finalized 
  goals: {self:number, other:number},
  points: {self:number, other:number},
  adversary?: ISeasonMatch
}