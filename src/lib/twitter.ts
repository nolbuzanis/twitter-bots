import { SendTweetV2Params, TwitterApi, EUploadMimeType } from 'twitter-api-v2';
import axios from 'axios';

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
const client = twitterClient.readWrite;

const HASHTAGS = [
  'LeafsForever',
  'MapleLeafs',
  'nhl',
  'leafs',
  'TorontoMapleLeafs',
  'goleafsgo',
  'leafsnation',
  'toronto',
];

export async function post(payload: SendTweetV2Params) {
  try {
    return client.v2.tweet(payload);
  } catch (error) {
    return { error };
  }
}

export async function uploadMedia(url: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'utf-8');

    const media_id = await client.v1.uploadMedia(buffer, {
      mimeType: EUploadMimeType.Mp4,
    });
    return media_id;
  } catch (error) {
    return { error };
  }
}

export function getHashtags(count: number){
  let returned = '';
  for(let i = 0; i < count; i++){
    returned += `#${HASHTAGS[Math.floor(Math.random() * HASHTAGS.length)]} `;
  }
  return returned;
}