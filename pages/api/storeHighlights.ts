import { NextApiRequest, NextApiResponse } from 'next';
import { insertMany } from '../../lib/mongodb';
import { getHighlightsFromGame, getLatestGameId } from '../../lib/nhl';

import Cors from 'cors';
import { runMiddleware } from '../../lib/middleware';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  await runMiddleware(request, response, cors);

  const gameId = await getLatestGameId();
  if (!gameId) return response.status(500).json({ error: 'No game id found!' });

  const highlights = await getHighlightsFromGame(gameId);
  if ('error' in highlights) {
    return response.status(500).json(highlights);
  }

  const result = await insertMany('highlights', highlights);
  if ('error' in result) {
    return response.status(500).json(result);
  }

  response.status(200).json({
    msg: 'Success',
    ids: highlights.map(({ _id }) => _id),
  });
}
