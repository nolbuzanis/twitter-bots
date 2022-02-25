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
  try {
    await runMiddleware(request, response, cors);
  } catch (err) {
    console.error(
      'Failed authentication with auth: ',
      request.headers.authorization
    );
    return response.status(401).json(err);
  }

  console.log('Suceeded!');

  response.status(200).json({
    msg: 'Success',
  });
}
