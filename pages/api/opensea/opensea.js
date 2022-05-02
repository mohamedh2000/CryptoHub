const axios = require('axios');

export default async function handler(req, res){
    const openSeaApi = 'dc30eb5387db4bdf8ae6f0db7c624258';
    axios('https://api.opensea.io/api/v1/collections').then(data => {
      res.send(data['data']);  
    })    
    

}

