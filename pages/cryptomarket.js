import { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import CryptoTab from '../Components/CryptoTab';
import CryptoModule from '../Components/CryptoModule';
import { motion } from 'framer-motion';

export default function CryptoMarket() {
	const [listings, setListings] = useState([]);
	const [chosenCrypto, setChosenCrypto] = useState(false);
	const [chosenCID, setChosenCID] = useState();    
	const [chosenCryptoData, setChosenCryptoData] = useState();
	const [currentMetaData, setMetadata] = useState();

	const variants = {
		isClicked: { width: '50%' },
		notClicked: { width: '100%' }
	}

	useEffect(() => {
		setChosenCrypto(false);
		setChosenCryptoData();
		axios('/api/home').then(async (data) => {
			Object.values(await data)[0]['data'].map((crypto_data) => {
				setListings(listings => [...listings, crypto_data]);
			})
		})
	}, []);

	function openDashboard(cid) {
		axios(`/api/crypto/id/${cid}`).then((data) => {
			axios(`api/crypto/metadata/${cid}`).then((metadata) => {
				console.log(metadata.data.data);
				console.log(cid);
				console.log(data.data[0].data);
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

	return (
		<div id="crypto_col" className={chosenCrypto ? 'absolute row w-full h-screen' : 'absolute w-full h-screen'} style={{ display: 'flex', marginTop: '80px' }}>
		<motion.ui
			id="list_cryptos"
			className={chosenCrypto ? 'column' : ''}
			variants={variants}
			animate={chosenCrypto ? "isClicked" : "notClicked"}
			transition={{ duration: 0.21, tween: 'tween', delayChildren: 0.5, staggerChildren: 0.5, staggerDirection: -1 }}
			style={{ listStyleType: "none", overflow: 'scroll' }}>
			{
				listings.map(crypto_data =>
					<motion.li className=".flex"
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
