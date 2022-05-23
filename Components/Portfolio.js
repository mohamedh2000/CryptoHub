import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import axios from 'axios';
import Transaction from './Transaction';
import { motion, AnimatePresence } from 'framer-motion';
import UserChart from '../Components/UserChart';
import Nft from '../Components/Nft';
import WalletList from '../Components/WalletList.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

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
		setCoins(walletData[1]);
		setNfts(walletData[2]);
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
		walletStyle: "bg-yellow-400 text-white text-base w-full rounded-full font-semibold py-2 px-4 shadow-md" + 
		" hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" + 
		" focus:ring-offset-2 focus:ring-offset-yellow-200 "
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
		<WalletList w3Id={w3Id}/>	
		<div className="flex h-full w-9/12 flex-col absolute items-center float-right right-0">
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
				className="rounded-xl mr-5 flex text-center justify-center tracking-wide text-2xl font-bold w-3/4 p-4 max-w-5xl shadow-xl ring-4 ring-yellow-400"
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
					style={{  marginTop: "20px" }}
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
				className="rounded-xl flex text-center justify-center tracking-wide text-2xl font-bold w-3/4 p-4 max-w-5xl shadow-xl ring-4 ring-yellow-400"
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
					style={{ marginTop: "20px" }}
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
