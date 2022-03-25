import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyResult } from 'aws-lambda';

import { insertMany } from '../../lib/mongodb';
import { getHighlightsFromGame, getLatestGameId } from '../../lib/nhl';

// import Cors from 'cors';
// import { runMiddleware } from '../../lib/middleware';

// Initializing the cors middleware
// const cors = Cors({
//   methods: ['GET', 'HEAD'],
// });

const storeHighlights: ValidatedEventAPIGatewayProxyEvent<void> = async (
  _request
) => {
  // try {
  //   //await runMiddleware(request, response, cors);
  // } catch (err) {
  //   console.error(
  //     'Failed authentication with auth: ',
  //     request.headers.authorization
  //   );
  //   return response(401, {
  //     error: err,
  //   });
  // }

  const gameId = await getLatestGameId();
  if (!gameId) return errorResponse('No game id found!');

  const highlights = await getHighlightsFromGame(gameId);
  if ('error' in highlights) {
    return errorResponse(highlights.error);
  }

  console.log('Inserting into mongo...');
  let writeErrors;

  const result = await insertMany('highlights', highlights);
  if (typeof result !== 'string') {
    if (result.error.writeErrors) {
      ({ writeErrors } = result.error);
    } else {
      return errorResponse(result.error);
    }
  }

  return response(201, {
    msg: 'Success',
    ids: highlights.map(({ _id }) => _id),
    writeErrors,
  });
};

const errorResponse = (error) => response(500, { error });

function response(statusCode = 200, body): APIGatewayProxyResult {
  return {
    statusCode,
    body,
  };
}

export const main = middyfy(storeHighlights);
