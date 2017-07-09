import { NextFunction, Request, Response, Router } from "express";
import { MatchSchema, Match } from "../schemas/match";

import { IMatchModel } from "../models/match";



/**
 * / route
 *
 * @class Match
 */
export class MatchRouter {
  router: Router

  /**
   * Constructor
   *
   * @class IndexRoute
   * @constructor
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getById);
  }


  public getAll(req: Request, res: Response, next: NextFunction) {
      console.log("Triggered getAll: "+req);
      Match.find().then( (matches:IMatchModel[]) => {
          console.log("Inside then of find");
          res.json(matches);
          next();
      }, err => {
        console.log("Error on getAll "+err);
        next();
      })
      .catch( err => res.status(400).send(err));
  }

  public getById(req: Request, res: Response, next: NextFunction) {
      var id = req.params["_id"];

      Match.findById(id).then( (match:IMatchModel) => {
        if (match === null) {
          res.sendStatus(404);
          next();
          return;
        }
        res.json(match);
        next();

      }).catch( err => res.status(400).send(err));
  }


}

const matchRoutes = new MatchRouter();
matchRoutes.init();
export default matchRoutes.router;