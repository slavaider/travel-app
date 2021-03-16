import {connectToDatabase} from "../../../util/mongodb";
import {ObjectId} from 'mongodb'

const bcrypt = require('bcryptjs');

function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}

export default async (req, res) => {
    const {db} = await connectToDatabase();
    const {email, password, name, imageUrl, type, id} = req.body.user

    if (type === 'auto_login') {
        if (byteCount(id) === 24) {
            const candidate = await db
                .collection("User")
                .findOne({_id: ObjectId(id.toString())})
            if (candidate) {
                res.json({
                    id: candidate._id,
                    imageUrl: candidate.imageUrl,
                    name: candidate.name
                });
            } else {
                res.json({error: 'not valid'})
            }
        } else {
            res.json({error: 'not valid'})
        }
    }
    if (type === 'register') {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await db
            .collection("User")
            .insertOne({
                email,
                password: hashedPassword,
                name,
                imageUrl
            })
        res.json({id: newUser.ops[0]._id});
    }
    if (type === 'login') {
        const candidate = await db
            .collection("User")
            .findOne({email})
        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password)
            if (isSame) {
                res.json({
                    id: candidate._id,
                    imageUrl: candidate.imageUrl,
                    name: candidate.name
                });
            } else {
                res.json({error: 'Wrong Password'});
            }
        }
    }
}
