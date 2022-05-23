import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LabelList, Label, Text} from 'recharts';
import $ from 'jquery';

const UserChart = ({userCoins, currentChain, setChain}) => {

	const [chainData, setChainData] = useState([])
	const [chainName, setChainName] = useState(null);
	const [currentCoin, setCoin] = useState({});
	
	console.log(userCoins);
	
	const hoverChain = (e) => {
		if(chainName != e.name) {
			setChainName(e.name);
			let newData = e.coins;
			randomize(newData);
			setChainData(newData);	
		}
	}

	const hoverCoin = (e) => {
		if(currentCoin.name != e.name) {
			setCoin({
				name : e.name, 
				symbol: e.symbol, 
				value: (e.amount * e.inUSD).toFixed(2)
			});
		}
	}

	function CustomLabel({viewBox}) {
		const { cx, cy } = viewBox;
		return (
			<>
				<text x={cx} y={cy - 10} verticalAnchor="middle" textAnchor="middle"  >
					<tspan fontSize="26">
						{currentCoin.symbol || ""}
					</tspan>
				</text>
				<text x={cx} y={cy + 20} verticalAnchor="middle" textAnchor="middle">
					<tspan fontSize="0.5vw" >
						{currentCoin.name || ""}
					</tspan>
				</text>
				<text x={cx} y={cy + 60} verticalAnchor="middle" textAnchor="middle">
					<tspan fontSize="26">
						${currentCoin.value || ""}
					</tspan>
				</text>
			</>
		)
	}

	return (
		<main>
		{  
		(currentChain != 'all' ? 
			<PieChart width={800} height={600}>
				<Pie data={userCoins} cx="50%" cy="50%" 
				dataKey="amount" nameKey="symbol" 
				innerRadius={200}  
				paddingAngle={1}
				onMouseOver={(e) => hoverCoin(e)}
				>
					<Label content={<CustomLabel />}  position="center" />
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
					nameKey="chain" innerRadius={210} paddingAngle={1} 
					onMouseDown={(e) => {setChain(e.chain)}} 
					onMouseOver={(e)=> hoverChain(e)} >
					
					<Label content={({viewBox}) => {
						const {cx, cy} = viewBox;
						return (
							<text x={cx} y={cy - 160} verticalAnchor="middle" textAnchor="middle"> 
								<tspan fontSize="26">
									{chainName ? chainName.toUpperCase() :  ""}	
								</tspan>
							</text>
						)
					}} position="center"/>
					{
						userCoins.map((chain) => ( 
							<Cell key={chain.chain} fill={chain.color} 
								cornerRadius={30} />
						))
					}
					<Label content={({viewBox}) => {
						const {cx, cy} = viewBox;
						return (
							<text x={cx} y={cy + 160} verticalAnchor="middle" textAnchor="middle"> 
								<tspan fontSize="26">
									${chainData.reduce((total, coin ) => { 
										return total + (coin.amount * coin.inUSD) 
									}, 0).toFixed(2) }
								</tspan>
							</text>
						)
					}} position="center" />
				</Pie>
				<Pie id="innerPie" data={chainData} paddingAngle={1} 
					cx="50%" cy ="50%" dataKey="amount"
					nameKey="symbol" innerRadius={100} outerRadius={120} 
					onMouseOver={(e) => hoverCoin(e)} >
					
					<Label content={<CustomLabel />}  position="center" />
					{
						chainData.map((coin) => ( 
						<Cell key={coin.symbol} fill={coin.color} 
							cornerRadius={10}/>
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
