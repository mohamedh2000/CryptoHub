import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import CryptoTab from '../Components/CryptoTab';
import CryptoModule from '../Components/CryptoModule';
import TrendingComp from '../Components/TrendingComp.js';
import CryptoMarketList from '../Components/CryptoMarketList.js';

export default function CryptoMarket() {
	const [listings, setListings] = useState([]);
	const [trending, setTrending] = useState([]);
	const listingsRef = useRef([]);
	const trendingRef = useRef([]);
	
	useEffect(() => {
		if(listingsRef.current.length == 0) {
			axios('/api/home').then(async (data) => {
				let cmcData = data['data'];
				let tempCryptoDataMap = [];
				setListings(cmcData['cryptoData']['data']);
				setTrending(cmcData['trending']['coins']);
				listingsRef.current = cmcData['cryptoData']['data'];
				trendingRef.current = cmcData['trending']['coins'];
			})
		}
		else {
			setListings(listingsRef.current);
			setTrending(trendingRef.current);
		}
	}, []);

	const styles = {
		scrollItems: "snap-start w-96 flex-shrink-0 h-full flex items-center justify-center text-2xl"
	}

	return (
		<div id="crypto_col" className='absolute w-full flex flex-col h-screen' style={{ display: 'flex', marginTop: '80px' }}>
			<div className="snap-x h-1/4 mx-auto snap-mandatory space-x-5 mb-5 flex w-full">
				{
					trending.map(coin =>
						<li
						  key={coin.item.coin_id * Math.random() * 100} 
						  className={styles.scrollItems}>
							<TrendingComp grecoCoinId={coin.item.id} name={coin.item.name} symbol={coin.item.symbol} 
								mcRank={coin.item.market_cap_rank} picture={coin.item.thumb}   />	
						</li>
					)
				}
			</div>
			<CryptoMarketList listings={listings}/>	
		</div>
	);
}
