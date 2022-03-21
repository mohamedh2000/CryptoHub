import React, { useState } from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';

const UserChart = () => {
    const width = 400;
    const half = width/2;
    const [active, setActive] = useState(null);
    const coins = [
        {symbol:"ADA", amount:200, color:"#0033ad", inUSD:1.48}, 
        {symbol:"SOL", amount:5, color:"#00ffbd", inUSD:37.6}, 
        {symbol:"BTC", amount:43, color:"#F7931A", inUSD:37363}, 
    ]

    return (
        <main>
            <svg width={width} height={width}>
                <Group top={half} left={half}>
                    <Pie 
                    data={coins}
                    pieValue={(data) => data.amount * data.inUSD}
                    outerRadius={half} 
                    innerRadius={({ data }) => {
                        const size = active && active.symbol == data.symbol ? 12 : 8;
                        return half - size;
                    }} 
                    padAngle={0.01}
                    >
                        {(pie) => { 
                            //arcs are each piece of the pie for each segment/coin
                            return pie.arcs.map((arc) => {
                                return (
                                    <g key={arc.data.symbol}>
                                        <path d={pie.path(arc)} 
                                            fill={arc.data.color}
                                            onMouseEnter={() => setActive(arc.data)}
                                            onMouseLeave={() => setActive(null)} />
                                    </g>
                                )
                            })
                        }}
                    </Pie>
                    <Text 
                        textAnchor="middle"
                        fill="#000000">
                            ${coins.reduce((acc, coin) => acc + coin.amount * coin.inUSD, 0)}
                    </Text>

                </Group>

            </svg>
            </main>
    )
}

export default UserChart;