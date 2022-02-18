import { NextApiRequest, NextApiResponse } from 'next';

export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    arg0: NextApiRequest,
    arg1: NextApiResponse<any>,
    arg2: (result: any) => void
  ) => void
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      //check authorization header for api key
      try {
        const { authorization } = req.headers;

        if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
          return resolve(result);
        } else {
          return reject(result);
        }
      } catch (err) {
        return reject(result);
      }

      // return resolve(result);
    });
  });
}
