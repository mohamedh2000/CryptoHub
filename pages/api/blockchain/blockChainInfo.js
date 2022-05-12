const axios = require('axios');

function getBlockchainInfo(domain, address, apiKey, currentBlock) {

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

    return axios(domain + searchStringI).then(async (data) => {
        let results_ethTrans = data['data']['result'];
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
                axios(domain + searchStringTokenAmounts).then((tokenBalance) => {
                    val.amount = tokenBalance["result"];
                });
                tempMap.set(tempSymbol, 0);
                tokenAmounts.push(val);
            }
        });
        //sorting by timeStamp since both lists are already sorted for us
        insertSortedArray(arr, results_erc20_Trans);
        insertSortedArray(arr, results_nft_Trans);

        return [arr, tokenAmounts, results_nft_Trans];
    })
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
