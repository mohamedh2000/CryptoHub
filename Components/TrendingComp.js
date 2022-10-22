import React, {useEffect, useState, useRef} from 'react';
import { getNum } from './func';
import Image from 'next/image'
import { motion } from 'framer-motion';
import axios from 'axios';
import CryptoChart from './CryptoChart.js';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';


const TrendingComp = ({ grecoCoinId, name, symbol, mcRank, picture }) => {
	const [currentData, setCurrentData] = useState([]);
  	const dataRef = useRef([]);
	const [currentPrice, setCurrentPrice] = useState();
	const [priceChange, setPriceChange] = useState();

	useEffect(() => {
		if(dataRef.current.length == 0) {
			axios(`/api/crypto/id/chart/${grecoCoinId}?name=true`).then((chartData) => {
				setCurrentData(chartData.data);
				let prices = chartData.data.prices.slice(chartData.data.prices.length - 2);
				let currentPrice = prices[1][1];
				let priceChange = ((currentPrice - prices[0][1])/prices[0][1]) * 100;
				setCurrentPrice(currentPrice.toFixed(2))
				setPriceChange(priceChange.toFixed(2))
				dataRef.current = [chartData.data,currentPrice.toFixed(2), priceChange.toFixed(2)]
			});
		}
		else {
			setCurrentData(dataRef.current[0]);
			setCurrentPrice(dataRef.current[1]);
			setPriceChange(dataRef.current[2]);
		}
	}, []);

	const styles = {
		positive: "font-mono text-green-400",
		negative: "font-mono text-red-400"
	}

	return (
		<motion.button className="select-none mt-5 bg-white rounded-2xl p-5 shadow-xl overflow-hidden my-4 hover:bg-gray-50 w-full h-4/5 mt-5" 
		whileHover={{ translateY: -7.0 }}>
			<div id="trendingParentCont" className=" select-none flex flex-col items-center h-full">
				<div className="flex flex-col h-4/5">
					<h5> {symbol} </h5>
					<p className="text-sm overflow-visible whitespace-nowrap"> MCap Rank: {mcRank} </p>
					<h6>${currentPrice} </h6>
					<h6 className={(priceChange > 0 ? styles.positive : styles.negative)}> 
						<FontAwesomeIcon className={(priceChange > 0 ? styles.positive: styles.negative)} 
						icon={(priceChange > 0 ? faArrowUp : faArrowDown)} /> {priceChange} % 
					</h6>
				</div>
				<CryptoChart chartData={currentData}
					containerWidth={$("#trendingParentCont").width()} 
					containerHeight={$("#trendingParentCont").height() * 0.2} toolTip={false}/>
			</div>
		</motion.button>
	)

}

export default TrendingComp;
