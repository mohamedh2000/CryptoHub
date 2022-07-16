const axios = require('axios');
import { Redis } from '@upstash/redis';
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

export default async function handler(req, res) {
	const coinMK_api_key = process.env.COINMARKETCAP_KEY;
	const coinMK_domain = 'https://pro-api.coinmarketcap.com';
	const coinGeckoDomain = 'https://api.coingecko.com/api/v3';

	const client = Redis.fromEnv();

	let cryptoMarketD = await client.get('crypto_market_data');
	let trendingCoins = await client.get('trending_coins');
	if(cryptoMarketD == null) {
		let cryptoMarketData = await axios.get(coinMK_domain + '/v1/cryptocurrency/listings/latest', { 
			headers: {
				'X-CMC_PRO_API_KEY': coinMK_api_key
			}
		});
		await client.set('crypto_market_data', JSON.stringify(cryptoMarketData['data']));
		await client.expire('crypto_market_data', '900'); //15 minutes
		cryptoMarketD = cryptoMarketData['data'];
	}
	if(trendingCoins == null) {
		let trendingCoinData = await axios.get(`https://api.coingecko.com/api/v3/search/trending`);
		await client.set('trending_coins', JSON.stringify(trendingCoinData['data']));
		await client.expire('trending_coins', '86400'); //24 hours
		trendingCoins = trendingCoinData['data'];
	}
	res.status(200).json({'cryptoData': cryptoMarketD, 'trending':trendingCoins});

}
