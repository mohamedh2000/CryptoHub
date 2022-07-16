const axios = require('axios');
import { Redis } from '@upstash/redis';

export default async function handler(req, res){
	let userId = req.query.id;
	let walletId = req.body.walletId;
	const client = Redis.fromEnv(); 
	let removeStatus = await client.lrem(userId, 1, walletId);
	if(removeStatus == 1) {
		res.status(200).send("Success");
	}
	else {
		res.status(400).send("Failed");
	}
}
