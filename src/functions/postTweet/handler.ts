import { middyfy } from '@libs/lambda';
import { getHashtags, post, uploadMedia } from 'src/lib/twitter';

import {
  deleteHighlight,
  getLatestHighlight,
  updateHighlightAsTweeted,
} from '../../lib/mongodb';

const postTweet = async () => {
  const highlightToTweet = await getLatestHighlight();

  if (!highlightToTweet) {
    return { msg: 'No highlights found' };
  }

  if ('error' in highlightToTweet) {
    throw new Error(highlightToTweet.error);
  }
  const id = await uploadMedia(highlightToTweet.video.url);

  if (typeof id !== 'string') {

    //if processing error, delete the highlight (deprecate later when long vids are no longer being stored)
    if(id.error.message === 'Failed to process the media.'){
      await deleteHighlight(highlightToTweet._id);
      return postTweet();
    }

    throw new Error(id.error + JSON.stringify(highlightToTweet));
  }

  const text = `
  ${highlightToTweet.description}
  \n
  ${getHashtags(2)}
  `;

  const tweetResponse = await post({
    text,
    media: { media_ids: [id] },
  });

  if ('error' in tweetResponse) {
    throw new Error(tweetResponse.error);
  }

  const updatedResult = await updateHighlightAsTweeted(highlightToTweet._id);
  if ('error' in updatedResult) {
    throw new Error(updatedResult.error);
  }

  return highlightToTweet;
};

export const main = middyfy(postTweet);
