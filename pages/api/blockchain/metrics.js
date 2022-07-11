const axios = require('axios');

export default async function handler(req, res){
	const baseUri = "https://api.glassnode.com"
	const cvddEndpoint = "/v1/metrics/indicators/cvdd"

	axios.get(`${baseUri}${cvddEndpoint}?a=btc&api_key=${process.env.GLASSNODE_API_KEY}`).then((data) => {
		console.log(data);
	});

}
