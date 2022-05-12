const axios = require('axios');
const CoinGecko = require('coingecko-api');
import { Redis } from '@upstash/redis'
const CoinGeckoClient = new CoinGecko();

export default async function handler(req, res){

	const client = Redis.fromEnv();

	const value = await client.get('coin_gecko_coins');

	if(value == null) {
		let data = await CoinGeckoClient.coins.list();
		await client.set('coin_gecko_coins', data);
		await client.expire('coin_gecko_coins', '900'); //weekly
		value = data;
	}
	let availableCoins = value.data;
	let coinSupported = availableCoins.filter(coin => coin.name == req.query.chartid);
	if(coinSupported == []) {
		res.send([]);
	}
	else {
		let geckoId = coinSupported[0].id;
		let params = {
			days : 'max'
		}
		let data = await CoinGeckoClient.coins.fetchMarketChart(geckoId, params);
		res.send(JSON.stringify(data.data));
	}

}
