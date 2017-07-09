import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import mongoose = require("mongoose"); //import mongoose

//routes
import { MatchRouter } from "./routes/match";
import expressMatchRouter from "./routes/match";

//interfaces
import { IMatch } from "./interfaces/match"; //import IMatch

//models
import { IModel } from "./models/model"; //import IModel
import { IMatchModel } from "./models/match"; //import IMatchModel

//schemas
import { MatchSchema } from "./schemas/match"; //import matchSchema

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  private model: IModel; //an instance of IModel

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //instance defaults
    this.model = Object(); //initialize this to an empty object

    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();
  }

    /**
     * Create router.
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes():void {
        let router: express.Router;
        router = express.Router();


        //plug in our master router
        router.get("/",(req,res,next) => {
          res.json({message:"Hello world!"});
        });


        //use router middleware
        this.app.use("/",router);
        this.app.use('/match',  expressMatchRouter);
    }


  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    const MONGODB_CONNECTION: string = "mongodb://infinit_qs:fit4mlab!@ds143201.mlab.com:43201/qs_test";

    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    
/**
    //mount cookie parker
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    //mount override
    this.app.use(methodOverride());
*/

 
    //use q promises
    global.Promise = require("q").Promise;
    mongoose.Promise = global.Promise;

    //connect to mongoose
    let connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);

    //create models
    this.model.match = connection.model<IMatchModel>("Match", MatchSchema);

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });


    //error handling
    this.app.use(errorHandler());

  }
}