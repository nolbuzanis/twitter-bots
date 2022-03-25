import {
  response,
  ValidatedEventAPIGatewayProxyEvent,
  errorResponse,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { post, uploadMedia } from 'src/lib/twitter';

import {
  getLatestHighlight,
  updateHighlightAsTweeted,
} from '../../lib/mongodb';

const postTweet: ValidatedEventAPIGatewayProxyEvent<void> = async () => {
  const highlightToTweet = await getLatestHighlight();

  if (!highlightToTweet) {
    return response(404, { msg: 'No highlights found' });
  }

  if ('error' in highlightToTweet) {
    return errorResponse(highlightToTweet.error);
  }
  const id = await uploadMedia(highlightToTweet.video.url);

  if (typeof id !== 'string') {
    return errorResponse(id.error);
  }

  const tweetResponse = await post({
    text: highlightToTweet.description,
    media: { media_ids: [id] },
  });

  if ('error' in tweetResponse) {
    return errorResponse(tweetResponse.error);
  }

  const updatedResult = await updateHighlightAsTweeted(highlightToTweet._id);
  if ('error' in updatedResult) {
    return errorResponse(updatedResult.error);
  }

  response(200, highlightToTweet);
};

export const main = middyfy(postTweet);
