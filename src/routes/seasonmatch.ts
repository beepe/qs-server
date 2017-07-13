import { NextFunction, Request, Response, Router } from "express";
import { SeasonMatchSchema, SeasonMatch } from "../schemas/seasonmatch";
import { SeasonMatchService } from "../services/seasonmatch"
import { ISeasonMatchModel } from "../models/seasonmatch";

/**
 * / route
 *
 * @class SeasonMatchRouter
 */
export class SeasonMatchRouter {
  router: Router;
  seasonMatchService: SeasonMatchService;

  /**
   * Constructor
   *
   * @class SeasonMatchRouter
   * @constructor
   */
  constructor() {
    this.router = Router();
    this.init();
    this.seasonMatchService = new SeasonMatchService();
  }

  init() {
    console.log("Initializing SeasonMatchRouter")
    this.router.get('/', this.getAll);
    this.router.get('/:_id', this.getById);
    this.router.get('/:_id/deleteMatch/:matchId',this.deleteMatchFromSeasonMatch)
   }

  public getAll(req: Request, res: Response, next: NextFunction) {
      SeasonMatch.find().populate('tipMatches.match').then( (seasonmatches:ISeasonMatchModel[]) => {
          res.json(seasonmatches);
          next();
      }/**, err => {
        console.log("Error on getAll "+err);
        next();
      }*/)
      .catch( err => {
        console.log("Error caught: "+err)
        res.status(400).send(err)
      });
  }

  public getById(req: Request, res: Response, next: NextFunction) {
      var id = req.params["_id"];
      SeasonMatch.findById(id).populate('tipMatches.match').then( (seasonmatch:ISeasonMatchModel) => {
        if (seasonmatch === null) {
          res.sendStatus(404);
          next();
          return;
        }
        res.json(seasonmatch);
        next();

      }).catch( err => res.status(400).send(err));
  }

  public deleteMatchFromSeasonMatch(req: Request, res: Response, next: NextFunction) {
      var id = req.params["_id"];
      var matchid = req.params["_matchId"];

      // remove that match from seasonmatch
      this.seasonMatchService.deleteMatchFromSeasonMatch(id, matchid).then( (seasonmatch:ISeasonMatchModel) => {
        if (seasonmatch === null) {
          res.sendStatus(404);
          next();
          return;
        }
        res.json(seasonmatch);
        next();

      }).catch( err => res.status(400).send(err));
  }


  public addMatchToSeasonMatch(req: Request, res: Response, next: NextFunction) {
      var id = req.params["_id"];
      var matchid = req.params["_matchId"];
      var query = {"_id":id}
      SeasonMatch.schema.methods.addMatch(id,matchid).then ( (seasonmatch:ISeasonMatchModel) => {
          if (seasonmatch === null) {
            res.sendStatus(404);
            next();
            return;     
          }
          res.json(seasonmatch);  
          next();
        }).catch( err => res.status(400).send(err));

      // remove that match from seasonmatch
      var newTipmatch = {
        match: matchid, prediction: -1, yield: 0, correct: false
      }
      SeasonMatch.update(query,
        {$push: { tipMatches: {newTipmatch}}}).then ( (seasonmatch:ISeasonMatchModel) => {
          if (seasonmatch === null) {
            res.sendStatus(404);
            next();
            return;     
          }
          res.json(seasonmatch);  
          next();
        }).catch( err => res.status(400).send(err));
  }

}