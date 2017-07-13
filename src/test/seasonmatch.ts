import { SeasonMatchService } from '../services/seasonmatch';

import { suite, test } from "mocha-typescript";
import { ISeasonMatch } from "../interfaces/seasonMatch";
import { IMatch } from "../interfaces/match"
import { ISeasonMatchModel } from "../models/seasonMatch";
import { SeasonMatch } from "../schemas/seasonMatch";
import { Match, MatchSchema } from "../schemas/match";
import mongoose = require("mongoose");

@suite
class SeasonMatchTest {

  //store test data
  private data: ISeasonMatch;
  private matchdata: IMatch;

  private seasonMatchService: SeasonMatchService;

  public static before() {
    //use q promises
    global.Promise = require("q").Promise;

    //use q library for mongoose promise
    mongoose.Promise = global.Promise;

    //connect to mongoose and create model
    const MONGODB_CONNECTION: string = "mongodb://infinit_qs:fit4mlab!@ds143201.mlab.com:43201/qs_test";
    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);


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
  }

  /*
  @test.only("should create a new SeasonMatch")
  public create() {
    //create seasonMatch and return promise
    console.log("Start create test");
    //return new SeasonMatch(this.data).save().then( result =>   {
      return new Match(this.matchdata).save().then( result =>   {
      //verify _id property exists
      console.log("inside then");
      result._id.should.eventually.exist;
  
      //verify user
     /* result.user.name.should.equal("Bodo");
      result.season.should.equal("1");
      result.status.should.equal(1);
      console.log("Array has length "+result.tipMatches.length+": "+JSON.stringify(result.tipMatches))
      result.tipMatches.should.be.an('array');
      result.tipMatches[0].yield.should.equal(100);
 


    });
  }

 */ 

    @test("should create a new Match")
  public create() {
    //create match and return promise
    return new Match(this.matchdata).save().then(result => {
      //verify _id property exists
      result._id.should.exist;

      //verify email
      result.homeTeam.should.equal(this.matchdata.homeTeam);

      console.log("Date is "+result.startTime);
    });
  }


  @test("should find some seasonMatches")
  public findSome(done) {
      return SeasonMatch.find().then(
            res => {
                res.length.should.be.greaterThan(0);
                console.log("We have "+res.length+" seasonMatches in the DB");
                done();
            }, err=> {
              done();
            }
      ).catch( err => { 
      console.log(err); done();
    });
  }

  @test("should add a tipmatch to seasonmatch")
  public addMatch(done) {
    SeasonMatch.findOne().then( 
      res => {
        console.log("1 - now adding to seasonmatch "+res._id);
          this.seasonMatchService.addMatchToSeasonMatch(res._id, "5963e1e98ad39f6d4ca22636" ).then(
            res2 => {
              console.log("2");
              console.log("res2 is "+JSON.stringify(res2));
              res2.tipMatches.should.be.an('array').that.has.property('[0].match._id',"5963e1e98ad39f6d4ca22636");
              done();
              ;
            }
          ).catch( err => { 
      console.log(err); done();
    }); 
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