const axios = require('axios');
const redis = require('redis');

export default async function handler(req, res) {
	const coinMK_api_key = '793e67ba-734a-450c-8863-cab9af5f9224';
	const coinMK_domain = 'https://pro-api.coinmarketcap.com';
	const client = redis.createClient();

	client.on('error', (err) => console.log('Redis Client Error', err));

	await client.connect();

	const value = await client.get('crypto_market_data');
	if(value == null) {
		let cryptoMarketData = await axios.get(coinMK_domain + '/v1/cryptocurrency/listings/latest', { 
			headers: {
				'X-CMC_PRO_API_KEY': coinMK_api_key
			}
		});

		await client.set('crypto_market_data', JSON.stringify(cryptoMarketData['data']));
		await client.sendCommand(['EXPIRE', 'crypto_market_data', '900']);
		res.send(cryptoMarketData);
	}
	else {
		res.send(value);
	}
}
