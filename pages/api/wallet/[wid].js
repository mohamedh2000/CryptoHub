const axios = require('axios');

const getBlockchainInfo = require('../blockchain/blockChainInfo');

export default async function handler(req, res){
	const blockchainDomains = {
		ethDomain : 'https://api.etherscan.io/api',
		bscDomain : 'https://api.bscscan.com/api'
	}

	const blockchainApis = {
		ethKey: process.env.ETH_KEY,
		bscKey: process.env.BSC_KEY 
	}

	const currentTime = Date.now();

	let optionBlockNum = { 
		action: 'getblocknobytime',
		timestamp: Math.floor( currentTime / 1000), //get current time in Unix
		closest: "before",
		apikey: blockchainApis.ethKey 
	}

	let searchStringBlock = "?module=block";
	for( let key in optionBlockNum) {
		searchStringBlock += `&${key}=${optionBlockNum[key]}`;
	}
	if(req.query.wid) {
		let currentEthBlock = getBlock(blockchainDomains.ethDomain, searchStringBlock); //eth
		let currentBscBlock = getBlock(blockchainDomains.bscDomain, searchStringBlock); //bsc
		let ethRet = await getBlockchainInfo.getBlockchainInfo(blockchainDomains.ethDomain, req.query.wid, 
			blockchainApis.ethKey, currentEthBlock);

		let bscRet = await getBlockchainInfo.getBlockchainInfo(blockchainDomains.bscDomain, req.query.wid, 
			blockchainApis.bscKey, currentBscBlock);
		let ret = {};
		ret[req.query.wid] = { eth: ethRet };
		if(bscRet != {}) {
			ret[req.query.wid]['bsc'] = bscRet;
		}
		res.status(200).send(ret);
	}
}

async function getBlock(domain, searchBlock) {
	let data = await axios(domain + searchBlock);
	return parseInt(data["result"]);
}

export const config = {
	api: {
		responseLimit: false,
	},
}
