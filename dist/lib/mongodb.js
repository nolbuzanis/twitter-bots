var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;
const options = {};
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
export function addDocument(doc, docId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const highlightCollection = (yield clientPromise)
                .db('development')
                .collection('highlights');
            const data = docId ? Object.assign(Object.assign({}, doc), { _id: docId }) : doc;
            return highlightCollection.insertOne(data);
        }
        catch (error) {
            return { error };
        }
    });
}
// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
//# sourceMappingURL=mongodb.js.map