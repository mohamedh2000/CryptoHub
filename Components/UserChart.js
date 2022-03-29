import React, { useState } from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';
import $ from 'jquery';

const UserChart = ({userCoins}) => {
  const width = 400;
  const half = width / 2;
  const [active, setActive] = useState(null);
  console.log(userCoins);

  return (
    <main>
      <svg width={width} height={width}>
        <Group top={half} left={half}>
          <Pie
            data={userCoins}
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
                    <path
                      d={pie.path(arc)}
                      fill={arc.data.color}
                      onMouseEnter={() => setActive(arc.data)}
                      onMouseLeave={() => setActive(null)}
                    />
                  </g>
                );
              });
            }}
          </Pie>

          {active ? (
            <>
            <Text textAnchor="middle" fill="#000000" fontSize="30" dy={-15}>
              {`$${Math.floor(active.amount * active.inUSD)}`}
            </Text>
            <Text textAnchor="middle" fill={active.color} fontSize="20" dy={15}>
              {`${active.amount} ${active.symbol}`}
            </Text>
          </>
          ) : (
            <>
              <Text textAnchor="middle" fill="#000000" fontSize="30" dy={-15}>
                {`$${Math.floor(
                  userCoins.reduce((acc, coin) => acc + coin.amount * coin.inUSD, 0)
                )}`}
              </Text>
              <Text textAnchor="middle" fill="#000000" fontSize="20" dy={15}>
                {`${userCoins.length} Assets`}
              </Text>
            </>
          )}
        </Group>
      </svg>
    </main>
  );
};

export default UserChart;