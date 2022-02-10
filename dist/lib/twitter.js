var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TwitterApi } from 'twitter-api-v2';
const twitterClient = new TwitterApi({
    appKey: 'JtMCxuH5Un8Szm3f81X7iTBVU',
    appSecret: 'sZPK1O0flIeLLMU8JJWaDpnlA7PEkYHNPz0nFYg4KSphMcUvu8',
    accessToken: '1489033126101852162-olnGRdVidvw4KMX7ezaqiwUVrW9Nya',
    accessSecret: 'XBkPm2Z9HXVsRD7LTilzgStchDmGHto5sYY8i9BmmCaFi',
});
const client = twitterClient.readWrite.v2;
export function postTweet(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.tweet(payload);
        }
        catch (error) {
            return { error };
        }
    });
}
//# sourceMappingURL=twitter.js.map