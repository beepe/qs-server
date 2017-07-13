import { suite, test } from "mocha-typescript";
import { IMatch } from "../interfaces/match";
import { IMatchModel } from "../models/match";
import { MatchSchema, Match } from "../schemas/match";

import chai = require("chai");
import chaiAsPromised = require("chai-as-promised")
import mongoose = require("mongoose");



@suite
class MatchTest {

  //store test data
  private data: IMatch;



  public static before() {
    //use q promises
    global.Promise = require("q").Promise;

    //use q library for mongoose promise
    mongoose.Promise = global.Promise;

    //connect to mongoose and create model
    const MONGODB_CONNECTION: string = "mongodb://infinit_qs:fit4mlab!@ds143201.mlab.com:43201/qs_test";
    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

    //require chai and use should() assertions

    chai.use(chaiAsPromised);
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

  @test.only("Find a match")
  public find(done) {
    it('respond with matching records', function() {
      return Match.find({ round: 1 }). .homeTeam.should.eventually.length(3);
    });
  };


  @test("should create a new Match")
  public create(done) {
    //create match and return promise
    return new Match(this.data).save().then(result => {
      //verify _id property exists
      result._id.should.exist;

      //verify email
      result.homeTeam.should.equal(this.data.homeTeam);

      console.log("Date is "+result.startTime);
      done();
    });
  }

  @test("should find some matches")
  public findSome() {
      return Match.find().then(
            res => {
                res.length.should.be.greaterThan(0);
                console.log("We have "+res.length+" matches in the DB");
            }
      );
  }
}