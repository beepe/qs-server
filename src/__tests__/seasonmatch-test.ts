
import { IMatch } from "../interfaces/match";
import { IMatchModel } from "../models/match";
import { MatchSchema, Match } from "../schemas/match";

import mongoose = require("mongoose");

import { SeasonMatchService } from '../services/seasonmatch';
import { ISeasonMatch } from "../interfaces/seasonMatch";
import { ISeasonMatchModel } from "../models/seasonMatch";
import { SeasonMatch } from "../schemas/seasonMatch";





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
        console.log("Found season match "+JSON.stringify(res));
        expect(res[0].season).toEqual("1");
    });
  });

  test("should create a new SeasonMatch", (done) => {

  //create match and return promise
  new SeasonMatch(smt.data).save().then(result => {
    //verify _id property exists
    expect.assertions(5);
    console.log("We got seasonmatch: "+JSON.stringify(result));
    expect(result._id).toBeDefined();
    expect(result.tipMatches.length).toBeGreaterThan(0);
    expect(result.tipMatches[0].yield).toBe(100);

    // now let's immediately retrieve the stuff again
    SeasonMatch.find({"_id":result._id}).populate('tipMatches.match').then( res2 => {
        expect(res2[0]._id).toEqual(result._id);
        expect(res2[0].tipMatches[0].match.homeTeam).toEqual("SV Stupferich"); 
        console.log("Passed last test item!");
        done();
    }).catch( err => {
      console.log("Error in f2 Seasonmatch creation: "+err);
    });
    
  }).catch( err => {
    console.log("Error on Seasonmatch creation: "+err);
  });
});

 
test.only("should add a tipmatch to seasonmatch", (done) => {
    SeasonMatch.findById("596baac6ac925a107c1f7ce9").then( 
      res => {
        console.log("1 - now adding to seasonmatch "+res._id);
          smt.seasonMatchService.addMatchToSeasonMatch(res._id, "5963e1e98ad39f6d4ca22636" ).then(
            res2 => {
              console.log("2");
              console.log("res2 is "+JSON.stringify(res2));

              SeasonMatch.findById("596baac6ac925a107c1f7ce9").populate('tipMatches.match').then( res3 => {
                  expect(res3.tipMatches[0]).toHaveProperty("match._id","5963e1e98ad39f6d4ca22636");
                  expect(res3.tipMatches[0].match.homeTeam).toEqual("SV Stupferich");
                  done();
              }).catch( err => {
                  console.log("Error on proving added TM to SM"+err); 
                  done();
              });

            }
          ).catch( err => {
              console.log("Error on adding a TM to SM"+err); 
          }); 
      }
    ).catch( err => { 
        console.log("Error on finding a SM to add a TM: "+err);
    }); 

  });
 

}); // of describe
