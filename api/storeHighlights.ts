import { NextApiRequest, NextApiResponse } from 'next';
import { insertMany } from '../lib/mongodb';
import { getHighlightsFromGame, getLatestGameId } from '../lib/nhl';

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse
) {
  const gameId = await getLatestGameId();
  if (!gameId) return response.status(500).json({ error: 'No game id found!' });

  const highlights = await getHighlightsFromGame(gameId);
  if ('error' in highlights) {
    return response.status(500).json(highlights);
  }
  const highlightsWithId = highlights.map(({ id, ...rest }) => ({
    ...rest,
    _id: parseInt(id),
  }));

  const result = await insertMany('highlights', highlightsWithId);
  if ('error' in result) {
    return response.status(500).json(result);
  }

  response.status(200).json({
    msg: 'Success',
    ids: highlights.map(({ id }) => id),
  });
}
