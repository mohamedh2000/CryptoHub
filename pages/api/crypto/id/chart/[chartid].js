const axios = require('axios');
const CoinGecko = require('coingecko-api');
const redis = require('redis');
const CoinGeckoClient = new CoinGecko();

export default async function handler(req, res){

        const client = redis.createClient();
      
        client.on('error', (err) => console.log('Redis Client Error', err));
      
        await client.connect();

        // let data = await CoinGeckoClient.coins.list();
        // console.log(data);

        // await client.set('coin_gecko_coins', data);

        const value = await client.get('coin_gecko_coins');
        let availableCoins = JSON.parse(value).data;
        let coinSupported = availableCoins.filter(coin => 
            coin.name == req.query.chartid);
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