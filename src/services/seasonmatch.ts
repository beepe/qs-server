import { SeasonMatch } from "../schemas/seasonmatch";


export class SeasonMatchService {

    constructor() {

    }

    addMatchToSeasonMatch(id: string, matchid: string) {
        var query = {"_id":id};
        //{ match: {type: Schema.Types.ObjectId, ref: 'Match'}, prediction: Number, yield: Number, correct: Boolean }
        var newTipMatch = {match: Object(matchid), prediction: -1, yield: 20, correct:false};
        return SeasonMatch.update(query,
            {$push: {tipMatches: newTipMatch}})
    }



    deleteMatchFromSeasonMatch(id: string, matchid:string) {
        var query = {"_id":Object(id)};
        console.log("Deleting "+matchid+" from SeasonMatch "+id);

        return SeasonMatch.update(query,
        {$pull: { tipMatches : {"match": Object(matchid)}}},
        { safe: true });
    }

}