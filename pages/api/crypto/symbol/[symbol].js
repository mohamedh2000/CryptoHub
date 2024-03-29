const axios = require('axios');

export default function handler(req, res){
    const coinMK_api_key = process.env.COINMARKETCAP_KEY;
    const coinMK_domain = 'https://pro-api.coinmarketcap.com';

    axios.get(coinMK_domain + `/v1/cryptocurrency/quotes/latest?symbol=${req.query.symbol}`, {
        method: 'post',
        headers: {
            'X-CMC_PRO_API_KEY': coinMK_api_key
        }
    }).then(response => {
        res.send(response['data']);
    })


}
