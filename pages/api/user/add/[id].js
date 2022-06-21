const axios = require('axios');
import { Redis } from '@upstash/redis';
import Web3 from 'web3';

export default async function handler(req, res){
	console.log("im in add key");
	let userId = req.query.id;
	let walletId = req.body.walletId;
	let chain = req.body.chain;
	const client = Redis.fromEnv(); 
	let currList = await client.lrange(userId, 0, -1);
	console.log(currList);
	if(currList.indexOf(walletId) == -1 && Web3.utils.isAddress(walletId)) {
		await client.lpush(userId, walletId);
		//return is length of the list after the push 
		res.status(200).json(await client.lrange(userId, 0, -1));
	}
	else { 
		res.status(400).send("Bad WalletId");
	}
}
