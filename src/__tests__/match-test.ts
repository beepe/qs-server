
import { IMatch } from "../interfaces/match";
import { IMatchModel } from "../models/match";
import { MatchSchema, Match } from "../schemas/match";

import mongoose = require("mongoose");






class MatchTest {


  //store test data
  data: IMatch;

    constructor() {
      this.data = {
          homeTeam: "SV Stupferich",
          awayTeam: "ASV Durlach",
          startTime: new Date("2017-07-22T14:56:59.301Z"),
          quotes: [20,40,60],
          domain: "GER",
          result: -1,
          playStatus: -1,
          round: 1
        };
  }
}

 describe('Test of Match schema', () => {
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
      console.log("Disconnecting from mongoose");
      mongoose.disconnect(done)
    });

    let mt = new MatchTest();

    test('Find a match', () => {
      return Match.find({ round: 1 }).then( (res) => {
         expect(res[0].round).toEqual(1);
      });
    });

   test("should create a new Match", () => {
    //create match and return promise
    return new Match(mt.data).save().then(result => {
      //verify _id property exists
      expect(result._id).toBeDefined();
      expect(result.homeTeam).toEqual(mt.data.homeTeam);
    });
  });


  });

    

  
