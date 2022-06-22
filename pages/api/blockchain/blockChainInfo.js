import { Redis } from '@upstash/redis';

const axios = require('axios');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();
const coinMK_api_key = process.env.COINMARKETCAP_KEY;
const coinMK_domain = 'https://pro-api.coinmarketcap.com';

async function getBlockchainInfo(domain, address, apiKey, currentBlock) {

	let option = {
		action: 'txlist',
		address: address,
		startblock: 0,
		endblock: currentBlock, //TODO: Get a way to find the most recent block number,
		sort: 'desc', 
		apikey: apiKey
	}

	let optionErc20 = { 
		action: 'tokentx',
		address: address, 
		startblock: 0,
		endblock: currentBlock,
		sort: 'desc',
		apikey: apiKey
	}

	let optionNft = { //nft 
		action: 'tokennfttx',
		address: address, 
		startblock: 0,
		endblock: currentBlock,
		sort: 'desc',
		apikey: apiKey
	}

	let optionTokenBalance = { 
		action: "tokenbalance", 
		address: address, 
		contractAddress: null, 
		tag:"latest", 
		apikey: apiKey
	}

	let searchStringI = "?module=account";
	for( let key in option) {
		searchStringI += `&${key}=${option[key]}`;
	}

	let searchStringErc20 = "?module=account";
	for( let key in optionErc20) {
		searchStringErc20 += `&${key}=${optionErc20[key]}`;
	}

	let searchStringNft = "?module=account"; 
	for( let key in optionNft) {
		searchStringNft += `&${key}=${optionNft[key]}`;
	}

	let chainInfo = await axios(domain + searchStringI);
	let results_ethTrans = chainInfo['data']['result'];
	let arr = [];

	for (let x in results_ethTrans) {
		arr.push(results_ethTrans[x]);
	} //circular json issue so use this as a get around for now

	let erc20_data = await axios(domain + searchStringErc20);
	let results_erc20_Trans = erc20_data['data']['result'];
	let nft_data = await axios(domain + searchStringNft)
	let results_nft_Trans = nft_data['data']['result'];
	let tempMap = new Map();
	let tokenAmounts = [];

	const client = Redis.fromEnv();
	let allCoins = await client.get('coin_gecko_coins');

	results_erc20_Trans.forEach( (transaction) => {
		let tempSymbol = transaction.tokenSymbol;
		if(!tempMap.has(tempSymbol)) {
			let val = {symbol: null, name: null, amount: 0, color: null, inUSD: null, tokenAddress: null};
			val.color = "#" + ((1<<24)*Math.random() | 0).toString(16); //TODO: Make sure they aren't repeated
			val.name = transaction.tokenName;
			val.symbol = tempSymbol;
			val.tokenAddress = transaction.contractAddress;
			tempMap.set(tempSymbol.toLowerCase(), val);
		}
	});


	//remove any spaces, dots, parenthesis, and symbols in the names
	let arrTemp = Array.from(tempMap.keys()).map((key) => 
		key.replaceAll(/[^0-9a-z]/gi, '') 
	);
	let cryptoMarketData = await axios.get(coinMK_domain + 
		`/v2/cryptocurrency/quotes/latest?symbol=${arrTemp}&skip_invalid=true`, {
			headers: {
				'X-CMC_PRO_API_KEY': coinMK_api_key
			}
		});

	for(let coin in cryptoMarketData['data']['data']) {
		let currCoin = tempMap.get(coin.toLowerCase());
		let allMatches = cryptoMarketData['data']['data'][coin];
		if(allMatches.length == 1) {
			let quote = allMatches[0]["quote"]["USD"]["price"];
			currCoin.inUSD = quote;
			currCoin.cmcId = allMatches[0]["id"];
			tempMap.set(coin.toLowerCase(), currCoin);
		}
		else {
			let coinMatch = allMatches.filter((coinMatch) => 
				{
					coinMatch.name == currCoin.name;
				});
			if(coinMatch.length != 0) {
				let quote = coinMatch[0]["quote"]["USD"]["price"];
				currCoin.inUSD = quote;
				currCoin.cmcId = coinMatch[0]["id"];
				tempMap.set(coin.toLowerCase(), currCoin);
			}
		}
		getAmountUSD(coin.toLowerCase(), tempMap);
	}

	async function getAmountUSD(coin, tempMap) {
		let tempCoin = tempMap.get(coin);
		if(tempCoin != undefined) {
			optionTokenBalance.contractAddress = tempCoin.tokenAddress;
			let searchStringTokenAmounts = "?module=account";
			for (let key in optionTokenBalance) {
				searchStringTokenAmounts += `&${key}=${optionTokenBalance[key]}`;
			}
			let balance = await axios(domain + searchStringTokenAmounts)
			tempCoin.amount = balance.data.result;
			tempCoin.totalVal = tempCoin.amount * tempCoin.inUSD;
			tempMap.set(coin, tempCoin);
		}
	}
	//sorting by timeStamp since both lists are already sorted for us
	insertSortedArray(arr, results_erc20_Trans);
	insertSortedArray(arr, results_nft_Trans);
	return [arr, Array.from(tempMap.values()), results_nft_Trans];
}

function insertSortedArray(baseArray, resultsToAdd) {
	for (let num in resultsToAdd) {
		let currentTime = parseInt(resultsToAdd[num]['timeStamp']);
		for (let i = 0; i < baseArray.length; i++) {
			if (currentTime >= parseInt(baseArray[i]['timeStamp'])) {
				baseArray.splice(i, 0, resultsToAdd[num]);
				break;
			}
			if (i == baseArray.length - 1) {
				baseArray.push(resultsToAdd[num]);
				break;
			}
		}
	}
}

module.exports = { getBlockchainInfo }
