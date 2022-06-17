const axios = require('axios');

export default async function handler(req, res){
    const coinMK_api_key = process.env.COINMARKETCAP_KEY;
    const coinMK_domain = 'https://pro-api.coinmarketcap.com';

    let quotes = await axios.get(coinMK_domain + `/v2/cryptocurrency/quotes/latest?id=${req.query.cid}`, {
        method: 'post',
        headers: {
            'X-CMC_PRO_API_KEY': coinMK_api_key
        }
    })
    let cryptoInfo = await axios.get(coinMK_domain + `/v2/cryptocurrency/info?id=${req.query.cid}`, {
        method: 'post',
        headers: {
            'X-CMC_PRO_API_KEY': coinMK_api_key
        }
    })
	res.send([quotes['data'], cryptoInfo['data']]);

}
