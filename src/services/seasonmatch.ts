import { SeasonMatchSchema, SeasonMatch } from "../schemas/seasonmatch";
import { ISeasonMatchModel } from "../models/seasonmatch";

export class SeasonMatchService {

    constructor() {

    }

    deleteMatchFromSeasonMatch(id: string, matchid:string) {
        var query = {"_id":id,
            "tipMatches.match._id":matchid};
            
        return SeasonMatch.update(query,
        {$pull: { tipMatches: {'match._id':matchid}}});
    }
}