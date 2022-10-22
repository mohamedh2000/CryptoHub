import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import CryptoTab from './CryptoTab';
import CryptoModule from './CryptoModule';
import { motion } from 'framer-motion';

export default function CryptoMarketList({listings}) {
	const listingsRef = useRef([]);

	const [chosenCrypto, setChosenCrypto] = useState(false);
	const [chosenCID, setChosenCID] = useState();    
	const [chosenCryptoData, setChosenCryptoData] = useState();
	const [currentMetaData, setMetadata] = useState();

	const variants = {
		isClicked: { width: '50%' },
		notClicked: { width: '100%' }
	}

	function openDashboard(cid) {
		axios(`/api/crypto/id/${cid}`).then((data) => {
			axios(`api/crypto/metadata/${cid}`).then((metadata) => {
				setChosenCryptoData(data.data[0].data[cid]);
				setChosenCID(cid);
				setChosenCrypto(true);
				setMetadata(metadata.data.data[cid]);
			});
		})
	}

	const item = {
		hidden: { y: -1000 },
		show: {
			y: 0,
			transition: {
				duration: 1, type: 'spring'
			}
		}
	}

	const styles = {
		scrollItems: "snap-start w-96 flex-shrink-0 h-full flex items-center justify-center text-2xl"
	}

	return (
		<div className={(chosenCrypto ? 'row' : '') + " flex w-full h-screen  mt-1/4"}>

		<motion.ui
		id="list_cryptos"
		className={chosenCrypto ? 'column' : ''}
		variants={variants}
		animate={chosenCrypto ? "isClicked" : "notClicked"}
		transition={{ duration: 0.21, tween: 'tween', delayChildren: 0.5, staggerChildren: 0.5, staggerDirection: -1 }}
		style={{ listStyleType: "none", overflow: 'scroll' }}>

		{
			listings.map(crypto_data =>
				<motion.li className="flex"
				key={crypto_data.id}
				variants={item}
				initial="hidden"
				animate="show">
				<CryptoTab id={crypto_data.id} name={crypto_data.name} symbol={crypto_data.symbol}
				img="./crypto-broker.jpeg" price={crypto_data.quote}
				circ_supply={crypto_data.circulating_supply} total_supply={crypto_data.total_supply}
				cmc_rank={crypto_data.cmc_rank} platforms={crypto_data.platforms} openDashboard={openDashboard} />
				</motion.li>
			)
		}


		</motion.ui>
		{
			chosenCrypto ?
			< CryptoModule data={chosenCryptoData} CID={chosenCID} metaData={currentMetaData}/>
			:
			<></>
		}
		</div>
	);
}
