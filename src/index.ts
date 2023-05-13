import pick from 'lodash/pick';
import dayjs from 'dayjs';

const getDate = () => dayjs().format('DD-MM-YYYY');

export interface Env {
	API_KEY: string;
	RATES: KVNamespace;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const date = getDate();
		const cachedRate = await env.RATES.get(date);

		if (cachedRate) {
			return new Response(cachedRate);
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

			return new Response(data);
		}
	},
};
