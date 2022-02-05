import { SendTweetV2Params, TwitterApi } from 'twitter-api-v2';

const {
  TWITTER_APP_KEY,
  TWITTER_APP_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
} = process.env;

if (
  !TWITTER_APP_KEY ||
  !TWITTER_APP_SECRET ||
  !TWITTER_ACCESS_TOKEN ||
  !TWITTER_ACCESS_SECRET
) {
  throw new Error('Twitter keys are undefined!');
}

const twitterClient = new TwitterApi({
  appKey: TWITTER_APP_KEY,
  appSecret: TWITTER_APP_SECRET,
  accessToken: TWITTER_ACCESS_TOKEN,
  accessSecret: TWITTER_ACCESS_SECRET,
});
const client = twitterClient.readWrite.v2;

export async function postTweet(payload: SendTweetV2Params) {
  try {
    await client.tweet(payload);
  } catch (error) {
    return { error };
  }
}
