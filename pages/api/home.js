const axios = require('axios');
import { Redis } from '@upstash/redis'

export default async function handler(req, res) {
	const coinMK_api_key = '793e67ba-734a-450c-8863-cab9af5f9224';
	const coinMK_domain = 'https://pro-api.coinmarketcap.com';

	const client = Redis.fromEnv();

	const value = await client.get('crypto_market_data');
	if(value == null) {
		let cryptoMarketData = await axios.get(coinMK_domain + '/v1/cryptocurrency/listings/latest', { 
			headers: {
				'X-CMC_PRO_API_KEY': coinMK_api_key
			}
		});

		await client.set('crypto_market_data', JSON.stringify(cryptoMarketData['data']));
		await client.expire('crypto_market_data', '900');
	}
	else {
		res.send(value);
	}
}
