const axios = require('axios');

export default function handler(req, res){
    const etherscan_api_key = 'MK6YTGB5FRU29PTB4VR2J54XFUMXFQFNBN';
    const etherscan_domain = 'https://api.etherscan.io/api';

    let option = {
        action: 'txlist',
        address: req.query.wid,
        startblock: 0,
        endblock: 13807035, //TODO: Get a way to find the most recent block number 
        apikey: etherscan_api_key
    }

    let searchString = "?module=account";
    for( let key in option) {
        searchString += `&${key}=${option[key]}`;
    }

    axios(etherscan_domain + searchString).then((data) => {
        let results = data['data']['result'];
        let arr = [];
        for(let x in data['data']['result']) {
            arr.push(results[x]);
        } //circular json issue so use this as a get around
        res.status(200).send(arr);
    })



}