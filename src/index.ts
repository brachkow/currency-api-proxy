import pick from 'lodash/pick';
import dayjs from 'dayjs';

const getDate = () => dayjs().format('DD-MM-YYYY');

export interface Env {
  API_KEY: string;
  KEY: string;
  RATES: KVNamespace;
  KEYS: KVNamespace;
}

const getResponse = (data: string) => {
  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getData = async (env: Env) => {
  const date = getDate();
  const cachedRate = await env.RATES.get(date);

  if (cachedRate) {
    return getResponse(cachedRate);
  } else {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${env.API_KEY}`,
      {
        method: 'GET',
      },
    );

    const data = JSON.stringify(
      pick(await response.json(), ['timestamp', 'rates', 'base']),
    );

    await env.RATES.put(date, data);

    return getResponse(data);
  }
};

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    return await getData(env);
  },

  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (await env.KEYS.get(env.KEY)) {
      return await getData(env);
    } else {
      return new Response('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized',
      });
    }
  },
};
