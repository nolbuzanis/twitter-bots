import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};
const dbName = process.env.DATABASE_NAME || 'development';

type CollectionName = 'highlights';

const client = new MongoClient(uri || '', options);
const clientPromise = client.connect();

// if (process.env.NODE_ENV === 'development') {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
// In production mode, it's best to not use a global variable.

// }

export async function insertOne(collectionName: CollectionName, doc: {}) {
  try {
    const collection = (await clientPromise)
      .db(dbName)
      .collection(collectionName);

    return collection.insertOne(doc);
  } catch (error) {
    return { error };
  }
}

export async function insertMany(collectionName: CollectionName, docs: {}[]) {
  try {
    const collection = (await clientPromise)
      .db(dbName)
      .collection(collectionName);

    return collection.insertMany(docs);
  } catch (error) {
    return { error };
  }
}

interface Highlight {
  _id: number;
  type: string;
  date: string;
  video: {
    url: string;
  };
  title: string;
  blurb: string;
  description: string;
}

export async function getLatestHighlight() {
  try {
    const collection = (await clientPromise)
      .db(dbName)
      .collection('highlights');

    const query = { tweeted_at: { $exists: false } };

    const latestHighlight = await collection.findOne<Highlight>(query, {
      sort: { date: 'ascending' },
    });

    return latestHighlight;
  } catch (error) {
    return { error };
  }
}

export async function updateHighlightAsTweeted(docId: number) {
  const collection = (await clientPromise).db(dbName).collection('highlights');

  const query = { _id: docId };
  const update = { $set: { tweeted_at: new Date() } };

  try {
    const updateRes = await collection.updateOne(query, update);
    return updateRes;
  } catch (error) {
    console.error(error);
    return { error };
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
