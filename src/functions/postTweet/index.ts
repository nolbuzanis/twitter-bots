import { handlerPath } from '@libs/handler-resolver';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'post-tweet',
      },
    },
  ],
};
