export interface IMatch {
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  quotes: number[];
  result: number;
  playStatus: number;
  round: number;    //round will be calendar weeks. 201725 for example.
  domain: string;   // will be GER, ENG, INT or something.
}