import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark, faChartPie, faChartBar, faComments } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { getNum } from './func';
import CryptoChart from '../Components/CryptoChart.js';
import axios from 'axios';
import $ from 'jquery';

const CryptoModule = ({ data, CID, metaData }) => {
	let baseData = data;
	const [bookmarkActive, setBookmarkActive] = useState(false);
	const [portfolioActive, setPortfolioActive] = useState(false);
	const [chatActive, setChatActive] = useState(false);
	const [chartTab, setChartTab] = useState(true);
	const [currentData, setCurrentData] = useState([]);

	const activeTabCSS = "group bg-yellow-400 p-1.5 mx-4 rounded-xl font-medium shadow-xl";
	const inActiveTabCSS = "transform group hover:bg-yellow-200 hover:scale-105 p-1.5 mx-4 rounded-xl font-light hover:shadow-md";
	const activeBookmarkCSS = "p-2 right-0 bg-yellow-400 rounded-full px-3.5 float-right";
	const inActiveBookmarkCSS = "p-2 right-0 rounded-full px-3.5 hover:bg-yellow-200 float-right";

	function activateButton(name) {
		if(name == "portfolio") {
			setChartTab(false);
			setPortfolioActive(true);
			setChatActive(false);
		}
		else if(name == "chart") {
			setChartTab(true);
			setPortfolioActive(false);
			setChatActive(false);
		}
		else if(name == "chat") {
			setChartTab(false);
			setPortfolioActive(false);
			setChatActive(true);
		}
		else {
			setBookmarkActive(!bookmarkActive);
		}
	}

	useEffect(() => {
		let cryptoSym = baseData['name'];
		axios(`/api/crypto/id/chart/${cryptoSym}`).then((chartData) => {
			//make the chart here 
			setCurrentData(chartData.data);
		})
	}, [data]);

	return (
		<motion.div className=".select-none shadow-2xl bg-white rounded-xl flex
		shadow-lg w-1/2 my-4 right-0 justify-center mr-8 p-8 flex-col sticky"
		style={{y: '-100%', height:'80vh'}}
		animate={{ y: '100px'}}
		transition={{ type: "easein"}}
		>
			<div className="w-full h-1/10 r-0 my-1 top-0">
				<button 
				className={chartTab ? activeTabCSS : inActiveTabCSS}
				onClick={() => {activateButton("chart")}}>
					<FontAwesomeIcon className="mr-1" icon={faChartBar} /> 
					Chart
				</button>
				<button 
				className={portfolioActive ? activeTabCSS : inActiveTabCSS}
				onClick={() => {activateButton("portfolio")}}>
					<FontAwesomeIcon className="mr-1" icon={faChartPie} /> 
					Portfolio
				</button>
				<button 
				className={chatActive ? activeTabCSS : inActiveTabCSS}
				onClick={() => {activateButton("chat")}}>
					<FontAwesomeIcon className="mr-1" icon={faComments} /> 
					Chat
				</button>
				<button className={bookmarkActive ? activeBookmarkCSS : inActiveBookmarkCSS}
				onClick={() => {activateButton("bookmark")}}>
					<FontAwesomeIcon icon={faBookmark} /> 
				</button>
			</div>
			<div className=" w-full my-1 h-full space-y-10">
				{
					(metaData != undefined ? 
					<div>
						<img src={metaData['logo']} />
						<b>Description: </b>
						<i>{metaData['description']}</i>
					</div>
						:
						<></>
					)
				}
				<div className="chartContainer w-full">
					<CryptoChart chartData={currentData} 
					containerWidth={$(".chartContainer").width()}/> 
				</div>
			</div>
			{
				(metaData != undefined ? (
					Object.keys(metaData['urls']).map((url) => {
						if(metaData['urls'][url].length == 1) {
							<div>
							 url: <a> {metaData['urls'][url][0] }</a>
							</div>
						}

					}))
					: 
					<></>
				)
			}
		</motion.div>)
}
export default CryptoModule;
