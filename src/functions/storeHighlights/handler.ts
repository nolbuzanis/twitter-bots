import {
  errorResponse,
  response,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { insertMany } from '../../lib/mongodb';
import { getHighlightsFromGame, getLatestGameId } from '../../lib/nhl';

const storeHighlights: ValidatedEventAPIGatewayProxyEvent<void> = async () => {
  const gameId = await getLatestGameId();
  if (!gameId) return errorResponse('No game id found!');

  const highlights = await getHighlightsFromGame(gameId);
  if ('error' in highlights) {
    return errorResponse(highlights.error);
  }

  console.log('Inserting into mongo...');
  const ids = highlights.map(({ _id }) => _id);

  const result = await insertMany('highlights', highlights);
  if (typeof result !== 'string') {
    if (result.error.writeErrors) {
      const { writeErrors } = result.error;
      return response(200, { ids, writeErrors });
    } else {
      return errorResponse(result.error);
    }
  }

  return response(201, {
    msg: 'Success',
    ids,
  });
};

export const main = middyfy(storeHighlights);
