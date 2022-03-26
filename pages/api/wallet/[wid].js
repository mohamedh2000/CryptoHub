const axios = require('axios');

export default function handler(req, res){
    const etherscan_api_key = 'MK6YTGB5FRU29PTB4VR2J54XFUMXFQFNBN';
    const etherscan_domain = 'https://api.etherscan.io/api';

    let option = {
        action: 'txlist',
        address: req.query.wid,
        startblock: 0,
        endblock: 13807035, //TODO: Get a way to find the most recent block number,
        sort: 'desc', 
        apikey: etherscan_api_key
    }

    let optionErc20 = { //erc20
        action: 'tokentx',
        address: req.query.wid, 
        startblock: 0,
        endblock: 13807035,
        sort: 'desc',
        apikey: etherscan_api_key
    }

    let optionNft = { //nft 
        action: 'tokennfttx',
        address: req.query.wid, 
        startblock: 0,
        endblock: 13807035,
        sort: 'desc',
        apikey: etherscan_api_key 
    }

    let optionTokenBalance = { 
        action: "tokenbalance", 
        address: req.query.wid, 
        contractAddress: null, 
        tag:"latest", apikey:etherscan_api_key
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

    axios(etherscan_domain + searchStringI).then(async (data) => {
        let results_ethTrans = data['data']['result'];
        let arr = [];
        let contractAddresses = new Set();

        for (let x in results_ethTrans) {
            arr.push(results_ethTrans[x]);
        } //circular json issue so use this as a get around for now

        let erc20_data = await axios(etherscan_domain + searchStringErc20);
        let results_erc20_Trans = erc20_data['data']['result'];
        let nft_data = await axios(etherscan_domain + searchStringNft)
        let results_nft_Trans = nft_data['data']['result'];

        let tempMap = new Map();
        let tokenAmounts = [];
        results_erc20_Trans.forEach((transaction) => {
            let tempSymbol = transaction.tokenSymbol;
            if(!tempMap.has(tempSymbol)) {
                let val = {symbol: null, name: null, amount: 0, color: null, inUSD: null, tokenAddress: null};
                val.color = "#" + ((1<<24)*Math.random() | 0).toString(16); //TODO: Make sure they aren't repeated
                val.name = transaction.tokenName;
                val.symbol = tempSymbol;
                val.tokenAddress = transaction.contractAddress;
                optionTokenBalance.contractAddress = transaction.contractAddress;
                let searchStringTokenAmounts = "?module=account";
                for (let key in optionTokenBalance) {
                    searchStringTokenAmounts += `&${key}=${optionTokenBalance[key]}`;
                }
                axios(etherscan_domain + searchStringTokenAmounts).then((tokenBalance) => {
                    val.amount = tokenBalance["result"];
                });
                tempMap.set(tempSymbol, 0);
                tokenAmounts.push(val);
            }
        });
        //sorting by timeStamp since both lists are already sorted for us
        insertSortedArray(arr, results_erc20_Trans, contractAddresses);
        insertSortedArray(arr, results_nft_Trans, contractAddresses);

        let tempAdd = [];
        for(let address of contractAddresses) {
            tempAdd.push(address);
        }
        
        let retArr = [arr, tempAdd, tokenAmounts];
        res.status(200).send(retArr);
    })

}

function insertSortedArray(baseArray, resultsToAdd, contractAddresses) {
    for (let num in resultsToAdd) {
        let currentTime = parseInt(resultsToAdd[num]['timeStamp']);
        contractAddresses.add(resultsToAdd[num]['contractAddress']);
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