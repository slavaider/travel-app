import {MongoClient} from 'mongodb'

let MONGODB_URI, MONGODB_DB = null
if (process.env.NODE_ENV !== 'test') {
    MONGODB_URI = process.env.MONGODB_URI
    MONGODB_DB = process.env.MONGODB_DB
} else {
    MONGODB_URI = "mongodb+srv://slavaider:azHfJgzbk3lYycSK@cluster0.tifvo.mongodb.net/TravelApp?retryWrites=true&w=majority"
    MONGODB_DB = "TravelApp"
}

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

if (!MONGODB_DB) {
    throw new Error(
        'Please define the MONGODB_DB environment variable inside .env.local'
    )
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
    cached = global.mongo = {conn: null, promise: null}
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
            return {
                client,
                db: client.db(MONGODB_DB),
            }
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}
