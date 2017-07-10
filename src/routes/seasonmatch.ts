import { NextFunction, Request, Response, Router } from "express";
import { SeasonMatchSchema, SeasonMatch } from "../schemas/seasonmatch";

import { ISeasonMatchModel } from "../models/seasonmatch";

/**
 * / route
 *
 * @class SeasonMatchRouter
 */
export class SeasonMatchRouter {
  router: Router

  /**
   * Constructor
   *
   * @class SeasonMatchRouter
   * @constructor
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    console.log("Initializing SeasonMatchRouter")
    this.router.get('/', this.getAll);
    this.router.get('/:_id', this.getById);
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


}