import {connectToDatabase} from "../../../util/mongodb";

export default async (req, res) => {
    const {db} = await connectToDatabase();
    const {type} = req.body
    const response = await db
        .collection('Country')
        .findOne({type})
    res.json({data: response.data})
}
