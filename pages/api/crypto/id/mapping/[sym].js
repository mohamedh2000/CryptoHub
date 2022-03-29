const axios = require('axios');

export default function handler(req, res) {
    const coinMK_api_key = '793e67ba-734a-450c-8863-cab9af5f9224';
    const coinMK_domain = 'https://pro-api.coinmarketcap.com';
    const coinSym = req.query.sym;

    ///cryptocurrency/quotes/latest
    axios.get(coinMK_domain + `/v1/cryptocurrency/map?symbol=${coinSym}`, {
        headers: {
            'X-CMC_PRO_API_KEY': coinMK_api_key
        }
    }).then(response => {
        res.send(response['data']);
    })
}