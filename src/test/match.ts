import { suite, test } from "mocha-typescript";
import { IMatch } from "../interfaces/match";
import { IMatchModel } from "../models/match";
import { MatchSchema } from "../schemas/match";
import mongoose = require("mongoose");

@suite
class MatchTest {

  //store test data
  private data: IMatch;

  //the Match model
  public static Match: mongoose.Model<IMatchModel>;

  public static before() {
    //use q promises
    global.Promise = require("q").Promise;

    //use q library for mongoose promise
    mongoose.Promise = global.Promise;

    //connect to mongoose and create model
    const MONGODB_CONNECTION: string = "mongodb://infinit_qs:fit4mlab!@ds143201.mlab.com:43201/qs_test";

    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
    MatchTest.Match = connection.model<IMatchModel>("Match", MatchSchema);

    //require chai and use should() assertions
    let chai = require("chai");
    chai.should();
  }

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

  @test("should create a new Match")
  public create() {
    //create match and return promise
    return new MatchTest.Match(this.data).save().then(result => {
      //verify _id property exists
      result._id.should.exist;

      //verify email
      result.homeTeam.should.equal(this.data.homeTeam);

      console.log("Date is "+result.startTime);
    });
  }

  @test("should find some matches")
  public findSome() {
      return MatchTest.Match.find().then(
            res => {
                res.length.should.be.greaterThan(0);
                console.log("We have "+res.length+" matches in the DB");
            }
      );
  }
}