import { SeasonMatch } from './../schemas/seasonmatch';
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
      console.log("Array has length "+result.tipMatches.length+": "+JSON.stringify(result.tipMatches))
      result.tipMatches.should.be.an('array');
      result.tipMatches[0].yield.should.equal(100);

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

  @test("should add a tipmatch to seasonmatch")
  public addMatch(done) {
    SeasonMatchTest.SeasonMatch.findOne().then( 
      res => {
        console.log("1 - now adding to seasonmatch "+res._id);
          SeasonMatchTest.SeasonMatch.schema.statics.addMatch(res._id, "5963e1e98ad39f6d4ca22636" ).then(
            res2 => {
              console.log("2");
              console.log("res2 is "+JSON.stringify(res2));
              res2.tipMatches.should.be.an('array').that.has.property('[0].match._id',"5963e1e98ad39f6d4ca22636");
              done();
              ;
            }
          )
      }
    ).catch( err => { 
      console.log(err); done();
    }); 
    
  }

  /*
  @test("should remove the tipmatch from seasonmatch")
  public deleteMatch() {

  }*/
}