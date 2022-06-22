import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import { getNum } from './func.js';

const CryptoChart = ({ chartData, containerWidth}) => {
	const [chartPrices, setChartPrices] = useState([]);

	useEffect(() => {
		let finalArr = [];
		if(chartData['prices']) {
			for(let i = 0; i < chartData['prices'].length; i++) {
				finalArr.push(
					{
						price: chartData['prices'][i][1].toFixed(2),
						marketCap: (chartData['market_caps'][i][1] ? getNum(chartData['market_caps'][i][1].toFixed(2)) : 0),
						volume: chartData['total_volumes'][i][1].toFixed(2)
					}
				)
			}
			setChartPrices(finalArr);
		}
	}, [chartData])

	return (
		<AreaChart className="mt-10" width={containerWidth} 
			height={400} data={chartPrices}
			margin={{
				top: 10,
				right: 30,
				left: 0,
				bottom: 0,
			}}>
				<Tooltip  />
				<Area type="monotone" dataKey="price" stackId="1" 
					stroke="#FFBF00" fill="#FFBF00" />
				<Area type="monotone" dataKey="marketCap" stackId="1"
					stroke="#FFBF00" fill="#FFBF00" />
		</AreaChart>
	)
}

export default CryptoChart;
