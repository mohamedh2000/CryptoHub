import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LabelList, Label } from 'recharts';
import $ from 'jquery';

const UserChart = ({userCoins, currentChain, setChain}) => {

	const [chainData, setChainData] = useState([])
	const [chainName, setChainName] = useState(null);

	//for dev cases only
	const randomize = (coins) => {
		coins.forEach((coin) => {
			coin.amount = Math.random() * 10;
			while (coin.amount * coin.inUSD > 1000) {
				coin.amount = Math.random() * 10; 
				}
			})
		}

	randomize(userCoins);
	const hoverChain = (e) => {
		if(chainName != e.name) {
			setChainName(e.name);
			let newData = e.coins;
			randomize(newData);
			setChainData(newData);	
			}
		}

	return (
		<main>
		{  (currentChain != 'all' ? 
		<PieChart width={800} height={600}>
			<Pie data={userCoins} cx="50%" cy="50%" 
			dataKey="amount" nameKey="symbol" 
			innerRadius={200}  
			paddingAngle={1}
			>
			{
				userCoins.map((coin) => (
					<Cell key={coin.symbol} fill={coin.color} cornerRadius={30}/>
				))
			}
			</Pie>
		</PieChart>
			:
			<PieChart width={800} height={600}>
				<Pie data={userCoins} cx="50%" cy="50%" dataKey="amount" 
				nameKey="chain" innerRadius={200} paddingAngle={1} 
				onMouseDown={(e) => {setChain(e.chain)}} 
				onMouseOver={(e)=>hoverChain(e)} >
				{
				userCoins.map((chain) => ( 
				<Cell key={chain.chain} fill={chain.color} cornerRadius={30}/>
					))
				}
				</Pie>
				<Pie id="innerPie" data={chainData} paddingAngle={1} cx="50%" cy ="50%" dataKey="amount"
				nameKey="symbol" innerRadius={80} outerRadius={100} >
				{
				chainData.map((coin) => ( 
				<Cell key={coin.symbol} fill={coin.color} cornerRadius={10}/>
					))
				}
				</Pie>
			</PieChart>
			)
			}
		</main>
		);
};

export default UserChart;
