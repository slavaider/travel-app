import {connectToDatabase} from "../../../util/mongodb";

export default async (req, res) => {
    const {db} = await connectToDatabase();
    const {value, alias, ownerName, ownerId} = req.body
    await db
        .collection('Country')
        .updateMany(
            {data: {$elemMatch: {capital_alias: alias}}},
            {$pull: {"data.$[t].rating": {[ownerId]: {$exists: true}}}},
            {arrayFilters: [{"t.capital_alias": alias}]},
        )
    await db
        .collection('Country')
        .updateMany(
            {data: {$elemMatch: {capital_alias: alias}}},
            {
                $push: {
                    "data.$[t].rating": {
                        [ownerId]: {
                            ownerName,
                            value
                        }
                    }
                }
            },
            {arrayFilters: [{"t.capital_alias": alias}]},
        )
    res.json({data: 200})
}
