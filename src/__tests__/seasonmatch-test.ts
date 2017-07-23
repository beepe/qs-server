import { ISeasonMatchModel } from './../models/seasonmatch';

import { IMatch } from "../interfaces/match";
import { IMatchModel } from "../models/match";
import { MatchSchema, Match } from "../schemas/match";

import mongoose = require("mongoose");

import { SeasonMatchService } from '../services/seasonmatch';
import { ISeasonMatch } from "../interfaces/seasonMatch";
import { SeasonMatch } from "../schemas/seasonMatch";

import * as Q from "q";





class SeasonMatchTest {

  //store test data
  data: ISeasonMatch;
  matchdata: IMatch;
  seasonMatchService: SeasonMatchService;

  constructor() {
    this.data  = {
      league: "GER1",
      user: {name: "Bodo"},
      tipMatches: [{ match: Object("5963e1f9f815bc6c20c8a317"), prediction: 1, yield: 100, correct: false }],
      season: "1",  // replace with season object
      homeAway: 1,  // 1-home, 2-away, 0-neutral
      status: 1, // 1-untouched, 2-saved, 3-intermediary, 4-finalized 
      goals: {self:0, other:0},
      points: {self:1, other:1},
          };

      this.matchdata = {
        homeTeam: "SV Stupferich",
        awayTeam: "ASV Durlach",
        startTime: new Date("2017-07-22T14:56:59.301Z"),
        quotes: [20,40,60],
        domain: "GER",
        result: -1,
        playStatus: -1,
        round: 1
      };
    this.seasonMatchService = new SeasonMatchService();
    let x = new Match();
  }
}

describe('Test of SeasonMatch schema', () => {
  let comment;

  beforeAll( () => {
    //use q promises
    global.Promise = require("q").Promise;

    //use q library for mongoose promise
    mongoose.Promise = global.Promise;

    //connect to mongoose and create model
    const MONGODB_CONNECTION: string = "mongodb://infinit_qs:fit4mlab!@ds143201.mlab.com:43201/qs_test";
    //let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

    //require chai and use should() assertions

    mongoose.connect(MONGODB_CONNECTION);
    mongoose.connection.on("connected", () => {
      console.log("Connected to database " + MONGODB_CONNECTION);
    });
    mongoose.connection.on("error", (err) => {
      console.log("Database error " + err);
    });


  });

  afterAll((done) => {
    mongoose.disconnect(done);
    console.log("Disconnecting from mongoose");
  });

  let smt = new SeasonMatchTest();

  test('Find a seasonmatch', () => {
    return SeasonMatch.find({ "season": "1" }).then( (res) => {
        //console.log("Found season match "+JSON.stringify(res));
        expect(res[0].season).toEqual("1");
    });
  });


  test("should create a new SeasonMatch, delete a match and add again", (done) => {
    var idOfTestSeasonMatch = 0;
    //create match and return promise
    new SeasonMatch(smt.data).save().then(result => {
      //verify _id property exists

      console.log("We got seasonmatch: "+JSON.stringify(result));
      expect(result._id).toBeDefined();
      expect(result.tipMatches.length).toBeGreaterThan(0);
      expect(result.tipMatches[0].yield).toBe(100);
      let idOfTestSeasonMatch = result._id;

      // delete the tipmatch 
      smt.seasonMatchService.deleteMatchFromSeasonMatch(idOfTestSeasonMatch, "5963e1f9f815bc6c20c8a317" ).then( r3 => {
        console.log("r3 is "+JSON.stringify(r3));

          SeasonMatch.findById(idOfTestSeasonMatch).populate('tipMatches.match').then( r4 => {
            console.log("r4 is "+JSON.stringify(r4));
              expect(r4.tipMatches).toHaveLength(0);
          
              // add it again
              smt.seasonMatchService.addMatchToSeasonMatch(idOfTestSeasonMatch, "5963e1e98ad39f6d4ca22636" ).then( r5 => {
                console.log("r5 is "+JSON.stringify(r5));

                SeasonMatch.findById(idOfTestSeasonMatch).populate('tipMatches.match').then( r6 => {
                  console.log("r6 is "+JSON.stringify(r6));
                  expect(r6.tipMatches).toHaveLength(1);
                  expect(r6.tipMatches[0].match.awayTeam).toEqual("VfB Stuttgart");
                  done();
                });

            });
        }, err4=> {
            console.log("Error on r4: "+err4);
            done(err4);
        });
     });


    }).catch( err => {
      console.log("Error on Seasonmatch creation: "+err);
      done(err);
    });

}); // of test

}); // of describe
