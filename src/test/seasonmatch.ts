import { suite, test } from "mocha-typescript";
import { ISeasonMatch } from "../interfaces/seasonMatch";
import { ISeasonMatchModel } from "../models/seasonMatch";
import { SeasonMatchSchema } from "../schemas/seasonMatch";
import mongoose = require("mongoose");

@suite
class SeasonMatchTest {

  //store test data
  private data: ISeasonMatch;

  //the SeasonMatch model
  public static SeasonMatch: mongoose.Model<ISeasonMatchModel>;

  public static before() {
    //use q promises
    global.Promise = require("q").Promise;

    //use q library for mongoose promise
    mongoose.Promise = global.Promise;

    //connect to mongoose and create model
    const MONGODB_CONNECTION: string = "mongodb://infinit_qs:fit4mlab!@ds143201.mlab.com:43201/qs_test";

    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
    SeasonMatchTest.SeasonMatch = connection.model<ISeasonMatchModel>("SeasonMatch", SeasonMatchSchema);

    //require chai and use should() assertions
    let chai = require("chai");
    chai.should();
  }

  constructor() {
    this.data = {
      league: "GER1",
      user: {name: "Bodo"},
      tipMatches: [{ match: Object("5963e1f9f815bc6c20c8a317"), prediction: 1, yield: 100, correct: false }],
      season: "1",  // replace with season object
      homeAway: 1,  // 1-home, 2-away, 0-neutral
      status: 1, // 1-untouched, 2-saved, 3-intermediary, 4-finalized 
      goals: {self:0, other:0},
      points: {self:1, other:1},
          };
  }

  @test("should create a new SeasonMatch")
  public create() {
    //create seasonMatch and return promise
    return new SeasonMatchTest.SeasonMatch(this.data).save().then(result => {
      //verify _id property exists
      result._id.should.exist;
  
      //verify user
      result.user.name.should.equal("Bodo");
      result.season.should.equal("1");
      result.status.should.equal(1);
      result.tipMatches.should.be.an('array').that.has.property('[0].yield', 100);

    });
  }

  @test("should find some seasonMatches")
  public findSome() {
      return SeasonMatchTest.SeasonMatch.find().then(
            res => {
                res.length.should.be.greaterThan(0);
                console.log("We have "+res.length+" seasonMatches in the DB");
            }
      );
  }
}