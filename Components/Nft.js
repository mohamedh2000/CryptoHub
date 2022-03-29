import React, { useEffect } from 'react';
import $ from 'jquery';
import {motion} from 'framer-motion'
import axios from 'axios';

//Props is the transaction 
//w3 is the web3 Object 
const Nft = ({ nft}) => {

    let nftData = {};

    const item = {
      hidden: { 
          y: -1000, 
          transition: {
              duration: 1, type:'spring'
          }
      },
      show: { 
          y: 0, 
          transition: {
              duration:1, type:'spring'
          } 
      }
  }

    useEffect(() => {
        axios(`https://api.opensea.io/api/v1/asset/${nft.contractAddress}/${nft.tokenID}/`).then((data) => {
            nftData = data["data"];
            let tempImg = "<img className=nftImg src=" + `${nftData["image_url"]}` + " width=800 height=800/>";
            $(".insertLiHere" + nft.tokenID).html(tempImg)
        })
    }, []);

  return (
    <motion.li
      className={"insertLiHere" + nft.tokenID}
      variants={item}
      initial="hidden"
      animate="show"
      exit="hidden"
    >
    </motion.li>
  );
};

export default Nft;