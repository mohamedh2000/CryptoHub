const axios = require('axios');
import { Redis } from '@upstash/redis';

export default async function handler(req, res){
	let userId = req.query.id;
		
	const client = Redis.fromEnv(); 
	const value = await client.lrange(userId, 0, -1);
	if(value != null) {
		res.status(200).json(value);
	}
}
