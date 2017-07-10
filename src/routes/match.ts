import { NextFunction, Request, Response, Router } from "express";
import { MatchSchema, Match } from "../schemas/match";

import { IMatchModel } from "../models/match";

/**
 * / route
 *
 * @class MatchRouter
 */
export class MatchRouter {
  router: Router

  /**
   * Constructor
   *
   * @class MatchRouter
   * @constructor
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    console.log("Initializing MatchRouter")
    this.router.get('/', this.getAll);
    this.router.get('/:_id', this.getById);
    this.router.get('/domain/:domain/round/:round', this.getByDomainRound);
  }

  public getByDomainRound(req: Request, res: Response, next: NextFunction) {
      var query = {"domain":req.params["domain"],
                  "round":req.params["round"]};
      console.log("In getByDomainRound");
      Match.find(query).then((matches:IMatchModel[]) => {
          res.json(matches);
          next();
      }).catch( err => {
        console.log("Error caught: "+err)
        res.status(400).send(err)
      });
  }


  public getAll(req: Request, res: Response, next: NextFunction) {
      Match.find().then( (matches:IMatchModel[]) => {
          res.json(matches);
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