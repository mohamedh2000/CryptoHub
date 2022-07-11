const axios = require('axios');

export default async function handler(req, res){
	const coinMK_api_key = process.env.COINMARKETCAP_KEY;
	const coinMK_domain = 'https://pro-api.coinmarketcap.com';
	axios(coinMK_domain + `/v2/cryptocurrency/info?id=${req.query.id}`,
		{
			headers: {
				'X-CMC_PRO_API_KEY': coinMK_api_key
			}
		}
	).then((data) => {
		res.status(200).send(data['data']);
	});

}
