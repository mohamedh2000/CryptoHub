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

    let optionII = { //erc20
        action: 'tokentx',
        address: req.query.wid, 
        startblock: 0,
        endblock: 13807035,
        sort: 'desc',
        apikey: etherscan_api_key
    }

    let optionIII = { //nft 
        action: 'tokennfttx',
        address: req.query.wid, 
        startblock: 0,
        endblock: 13807035,
        sort: 'desc',
        apikey: etherscan_api_key 
    }

    let searchStringI = "?module=account";
    for( let key in option) {
        searchStringI += `&${key}=${option[key]}`;
    }

    let searchStringII = "?module=account";
    for( let key in optionII) {
        searchStringII += `&${key}=${optionII[key]}`;
    }

    let searchStringIII = "?module=account"; 
    for( let key in optionIII) {
        searchStringIII += `&${key}=${optionIII[key]}`;
    }

    axios(etherscan_domain + searchStringI).then(async (data) => {
        let results_ethTrans = data['data']['result'];
        let arr = [];
        let contractAddresses = new Set();

        for (let x in results_ethTrans) {
            arr.push(results_ethTrans[x]);
        } //circular json issue so use this as a get around for now

        let erc20_data = await axios(etherscan_domain + searchStringII);
        let results_erc20_Trans = erc20_data['data']['result'];
        let nft_data = await axios(etherscan_domain + searchStringIII)
        let results_nft_Trans = nft_data['data']['result'];
        //sorting by timeStamp since both lists are already sorted for us
        insertSortedArray(arr, results_erc20_Trans, contractAddresses);
        insertSortedArray(arr, results_nft_Trans, contractAddresses);

        let tempAdd = [];
        for(let address of contractAddresses) {
            tempAdd.push(address);
        }
        let retArr = [arr, tempAdd];

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