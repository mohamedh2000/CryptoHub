import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import axios from 'axios';
import Transaction from './Transaction';
import { motion, AnimatePresence } from 'framer-motion';
import UserChart from '../Components/UserChart';
import Nft from '../Components/Nft';
import $ from 'jquery';

const chains = {
	ALL : 'all', ETH : 'eth', BSC : 'bsc'
}

const chainDomains = {
	ALL: null,
	ETH: 'https://etherscan.io/tx', 
	BSC: 'https://bscscan.com/tx'
}

//opensea API 
const Portfolio = () => {
	const web3 = new Web3(window.ethereum);
	const [currentChain, setChain] = useState(null);
	const [walletData, setWalletData] = useState(null)
	const [chainDomain, setChainDomain] = useState("");
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
				setWalletData(data['data']);
				$("#"+chains.ALL).focus();
				setChain(chains.ALL);
			});
		});
	}, []);

	useEffect(() => {
		switch (currentChain) {
			case chains.ALL: 
				$("#"+chains.ALL).focus();
				changeChain(walletData);
				setChainDomain(chainDomains.ALL);
				break;
			case chains.ETH:
				changeChain(walletData.eth);
				setChainDomain(chainDomains.ETH);
				$("#"+chains.ETH).focus();
				break;
			case chains.BSC: 
				changeChain(walletData.bsc);
				setChainDomain(chainDomains.BSC);
				$("#"+chains.BSC).focus();
				break;
			default:
				break;
		}
	}, [currentChain]);

	const sort = (baseArray, resultsToAdd) => {
		let i = 0;
		for(let num in resultsToAdd) {
			let currTime = parseInt(resultsToAdd[num]['timeStamp']);
			for(i; i < baseArray.length; i++) {
				if (currTime >= parseInt(baseArray[i]['timeStamp'])) {
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

	const getAllTransactions = (walletData) => {
		let allTransactions = [];
		for(let key in walletData) {
			let currData = walletData[key][0];
			currData.map((trans) => {trans.chain = key.toUpperCase()});
			(allTransactions.length == 0 ? 
				allTransactions.push(...currData) :
				sort(allTransactions, currData));
		}
		return allTransactions;
	}
	const getAllNFTs = (walletData) => {
		let allTransactions = [];
		for(let key in walletData) {
			let chain = key;
			let currData = walletData[key][2];
			currData.map((trans) => {trans.chain = chain});
			allTransactions.push(...currData);
		}
		return allTransactions;
	}

	const getAllCoins = (walletData) => {
		let allTransactions = [];
		for(let key in walletData) {
			let chain = key;
			let currData = walletData[key][1];
			currData.map((trans) => {trans.chain = chain});
			allTransactions.push(...currData);
		}
		return allTransactions;
	}

	const changeToChain = (walletData) => {
		setTransactions(walletData[0]);
		let tempCoins = walletData[1];
		setNfts(walletData[2]);
		tempCoins.forEach(async (coin) => {
			let results = await axios(`/api/crypto/id/mapping/${coin.symbol}`);
			let resultsArr = results["data"]["data"];
			let temp = resultsArr.filter((cryp) => 
				{
					let toMatchCrypAddress = cryp["platform"]["token_address"].toLowerCase();
					let crypToMatchAddress = coin.tokenAddress.toLowerCase();
					return cryp.symbol == coin.symbol && toMatchCrypAddress == crypToMatchAddress;
				})[0];
			try {
				let mappedId = temp.id;
				let quote = await axios(`/api/crypto/id/${mappedId}`);
				coin.inUSD = quote["data"]["data"][mappedId]["quote"]["USD"]["price"].toFixed(2);
			}
			catch(e) {
				console.log(e);
			}
		});
		setCoins(tempCoins);

	}

	const changeChain = (walletData) => {
		switch(currentChain) {
			case chains.ALL: 
				let transactions = getAllTransactions(walletData); //this will sort all transactions as well
				let allCoins = getAllCoins(walletData);
				let allNFTs = getAllNFTs(walletData);
				setTransactions(transactions);
				setNfts(allNFTs);
				setCoins(allCoins);
				break;
			default: 
				changeToChain(walletData);
				break;
		}
		$("#"+currentChain).focus();

	}

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

	const style = {
		chainStyle: "ring-2 ring-white shadow-xl py-3 focus:outline-none m-2 rounded-lg w-32" + 
		" focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50",
		walletStyle: "flex-shrink-0 bg-yellow-400 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md" + 
		" hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" + 
		" focus:ring-offset-2 focus:ring-offset-yellow-200"
	}

	const getChainCoins = () => {
		let retArr = []
		for(let key in walletData) {
			let chainData = {};
			chainData.chain = key;
			chainData.coins = walletData[key][1];
			chainData.amount = 0;
			chainData.color = "#" + ((1<<24)*Math.random() | 0).toString(16);
			walletData[key][1].forEach((coin) => {
				chainData.amount += (coin.amount * coin.inUSD)
			});
			retArr.push(chainData);
		}
		return retArr;
	}

	return (
		<div className="flex h-full w-full flex-row absolute items-center">
		<div className="flex h-full w-2/12 flex-col absolute items-center float-left">
		<ul className="flex h-full w-9/10 overflow-hidden" style={{marginTop:'20%', marginLeft:'20%'}}>
		<li className="h-1/8"  >
		<button className={style.walletStyle}>
		{w3Id}
		</button>
		</li>
		</ul>
		</div>
		<div className="flex h-full w-10/12 flex-col absolute items-center float-right right-0">
		<div>
		<button id={chains.ALL} className={style.chainStyle} onClick={() => {setChain(chains.ALL)}}>
		All	
		</button>
		<button id={chains.ETH} className={style.chainStyle} onClick={() => {setChain(chains.ETH)}}>
		ETH
		</button>
		<button id={chains.BSC} className={style.chainStyle} onClick={() => {setChain(chains.BSC)}} >
		BSC
		</button>
		</div>
		<div id="wallet_chart" className="mt-20">
		<UserChart userCoins={
			(currentChain != 'all' ? coins : getChainCoins())
		} currentChain={currentChain} setChain={setChain}/>
		</div>
		<div className="flex columns-2 w-full" >  
			<div className="flex w-1/2 flex-col items-center">
				<button
				className="rounded-xl mr-5 flex text-center justify-center tracking-wide 
				text-2xl font-bold w-3/4 p-4 max-w-5xl shadow-xl ring-4 ring-yellow-400"
				style={{ minWidth: "800px" }}
				onClick={() => {
					setShowTransactions(!showTransactions);
				}}
				>
				Transactions
				</button>
				<AnimatePresence >
				{showTransactions && (
					<motion.ul
					id="collapseTrans"
					className=" flex flex-col  w-3/4 max-w-5xl overflow-y-scroll"
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
						currentChain={chainDomain != null ? chainDomain : chainDomains[trans.chain]}
						/>
					))}
					</motion.ul>
				)}
				</AnimatePresence>
			</div>
			<div className="flex w-1/2 flex-col items-center">
				<button
				className="rounded-xl flex text-center justify-center tracking-wide 
				text-2xl font-bold w-3/4 p-4 max-w-5xl shadow-xl ring-4 ring-yellow-400"
				style={{ minWidth: "800px"}}
				onClick={() => {
					setShowNfts(!showNfts);
				}}
				>
				Nfts
				</button>
				<AnimatePresence >
				{showNfts && (
					<motion.ul
					id="collapseNft"
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
		</div>
		</div>
	);
};

export default Portfolio;
