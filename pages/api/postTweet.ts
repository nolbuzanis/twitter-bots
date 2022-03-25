import { NextApiRequest, NextApiResponse } from 'next';
import {
  getLatestHighlight,
  updateHighlightAsTweeted,
} from '../../src/lib/mongodb';

import Cors from 'cors';
import { runMiddleware } from '../../src/lib/middleware';
import { post, uploadMedia } from '../../src/lib/twitter';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    await runMiddleware(request, response, cors);
  } catch (err) {
    return response.status(401).json(err);
  }

  const highlightToTweet = await getLatestHighlight();

  if (!highlightToTweet) {
    return response.status(404).send({ msg: 'No highlights found' });
  }

  if ('error' in highlightToTweet) {
    return response.status(500).json(highlightToTweet);
  }
  const id = await uploadMedia(highlightToTweet.video.url);

  if (typeof id !== 'string') {
    return response.status(500).json(id);
  }

  const tweetResponse = await post({
    text: highlightToTweet.description,
    media: { media_ids: [id] },
  });

  if ('error' in tweetResponse) {
    return response.status(500).json(tweetResponse);
  }

  const updatedResult = await updateHighlightAsTweeted(highlightToTweet._id);
  if ('error' in updatedResult) {
    return response.status(500).json(updatedResult);
  }

  response.json(highlightToTweet);
}
