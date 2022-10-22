import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import {Pie} from '@visx/shape';
import {Group} from "@visx/group";

const UpdatedChart = () => {
	const [active, setActive] = useState(null);
	let width = 400;
	let coins = [
		{symbol:"ADA", amount: 200, color:"#0033ad", inUSD:"400"},
		{symbol:"SOL", amount: 2, color:"#00ffbd", inUSD:"400"},
		{symbol:"BTC", amount: 5, color:"#F7931A", inUSD:"400"}
	]	
	let half = `${width / 2}`;

	return (
		<main>
			<svg width={width} height={width}>
				<Group top={half} left={half}> 
					<Pie data={coins} 
					pieValue={(data) => data.amount * data.inUSD}
					outerRadius={half}
					innerRadius={half - 32}
					padAngle={0.01}
					>
					{pie => {
						return pie.arcs.map((arc) => {
							return (<g key={arc.data.symbol} onMouseEnter={() => setActive(arc.data)}>
									<path d={pie.path(arc)} fill={arc.data.color}>
									</path>
								</g>)
						})		
					}}	
					</Pie>
					<Pie data={coins} 
					pieValue={(data) => data.amount * data.inUSD}
					outerRadius={half - 64}
					padAngle={0.05}>
					{pie => {
                                                  return pie.arcs.map((arc) => {
                                                          return (<g key={arc.data.symbol} onMouseEnter={() => setActive(arc.data)}>
                                                                          <path d={pie.path(arc)} fill={arc.data.color}>
                                                                          </path>
                                                                  </g>)
                                                  })
                                          }}
					</Pie>

					

				</Group>
			</svg>
		</main>
	)
};

export default UpdatedChart;
