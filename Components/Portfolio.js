import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import axios from 'axios';
import Transaction from './Transaction';
import { motion, AnimatePresence } from 'framer-motion';
import UserChart from '../Components/UserChart';
import Nft from '../Components/Nft';

//opensea API 
const Portfolio = () => {
  const web3 = new Web3(window.ethereum);
  const [transactions, setTransactions] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [w3Id, setW3Id] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [showNfts, setShowNfts] = useState(false);

  useEffect(() => {
    web3.eth.requestAccounts().then((acc) => {
      setW3Id(acc[0].trim());
      axios(`/api/wallet/${acc[0]}`).then((data) => {
        setTransactions(data["data"][0]);
        let tempCoins = data["data"][1];
        setNfts(data["data"][2]);
        console.log(nfts);
        tempCoins.forEach(async (coin) => {
          let results = await axios(`/api/crypto/id/mapping/${coin.symbol}`);
          let resultsArr = results["data"]["data"];
          let mappedId = resultsArr.filter((cryp) => 
            {return cryp.symbol == coin.symbol && 
              cryp["platform"]["token_address"] == coin.tokenAddress;})[0].id;
          let quote = await axios(`/api/crypto/id/${mappedId}`);
          coin.inUSD = quote["data"]["data"][mappedId]["quote"]["USD"]["price"].toFixed(2);
        })
        setCoins(tempCoins);
      });
    });
  }, []);

  const container = {
    show: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 2,
        staggerDirection: 1,
        delayChildren: 1,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 2,
        staggerDirection: 1,
      },
    },
  };

  // table of all holdings and weighted averages
  // pie chart of all holdings

  return (
    <div className="flex h-full w-full flex-col absolute items-center">
        <div id="wallet_chart" className="mt-20">
            <UserChart userCoins={coins}/>
        </div>
      <div>
        <button
          className="rounded-xl flex text-center justify-center tracking-wide text-2xl font-bold w-3/4 p-4 max-w-5xl shadow-xl ring-4 ring-yellow-400"
          style={{ minWidth: "800px", marginTop: "10%" }}
          onClick={() => {
            setShowTransactions(!showTransactions);
          }}
        >
          Transactions
        </button>
        <AnimatePresence className="flex">
          {showTransactions && (
            <motion.ul
              id="collapseTrans"
              className="flex-col flex mt-5 w-3/4 max-w-5xl overflow-y-scroll"
              style={{ minWidth: "800px", marginTop: "20px" }}
              variants={container}
              initial={{ opacity: 0 }}
              animate="show"
              exit="hidden"
            >
              {transactions.map((trans) => (
                <Transaction
                  key="trans_1"
                  props={trans}
                  w3={web3}
                  w3Id={w3Id}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <div>
        <button
          className="rounded-xl flex text-center justify-center tracking-wide text-2xl font-bold w-3/4 p-4 max-w-5xl shadow-xl ring-4 ring-yellow-400"
          style={{ minWidth: "800px", marginTop: "10%" }}
          onClick={() => {
            setShowNfts(!showNfts);
          }}
        >
          Nfts
        </button>
        <AnimatePresence className="flex">
          {showNfts && (
            <motion.ul
              id="collapseTrans"
              className="flex-col flex mt-5 w-3/4 max-w-5xl overflow-y-scroll"
              style={{ minWidth: "800px", marginTop: "20px" }}
              variants={container}
              initial={{ opacity: 0 }}
              animate="show"
              exit="hidden"
            >
              {nfts.map((nftInfo) => (
                <Nft
                  key="nfts"
                  nft={nftInfo}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Portfolio;