import React from 'react';
import { motion } from 'framer-motion';
import { getNum } from './func';

const CryptoTab = ({ id, name, symbol, img, price, circ_supply, total_supply, 
    cmc_rank, platforms, openDashboard}) => {

    const priceData = price['USD'];

    return (

        <motion.button className="select-none focus:ring-2 active:ring-yellow-400 focus:ring-yellow-200  bg-white rounded-xl 
        shadow-xl overflow-hidden my-4 hover:bg-gray-50 w-1/2 " style={{ marginLeft: '25%' }} onClick={() => { openDashboard(id) }}
            whileHover={{ translateY: -7.0 }}
        >
            <div className="md:flex justify-center">
                <div className="p-8 w-full">
                    <h1 className="text-lg uppercase tracking-wide font-semibold"> {symbol}</h1>
                    <h4>{name}</h4>
                    <h1 className="text-lg uppercase tracking-wide text-green-600">
                        ${(priceData['price']) < 1 ? (priceData['price']).toFixed(4) : (priceData['price'].toFixed(2))}
                    </h1>
                    <div className="inline-flex flex-row content-center justify-items-center">
                        <div className="sm:flex-col lg:flex-row flex flex-wrap lg:flex-nowrap pr-1">
                            <div className="inline-flex flex-wrap lg:pr-10">
                                <h4 className="font-semibold pr-1"> 1 Hour: </h4>
                                <h4 className={priceData['percent_change_1h'] < 0 ? "text-red-500" : "text-green-500"}>
                                    {(priceData['percent_change_1h']).toFixed(2)}%
                                </h4>
                            </div>
                            <div className="inline-flex flex-wrap">
                                <h4 className="font-semibold pr-1 flex-wrap">  24 Hours: </h4>
                                <h4 className={priceData['percent_change_24h'] < 0 ? "text-red-500" : "text-green-500"}>
                                    {(priceData['percent_change_24h']).toFixed(2)}%
                                </h4>
                            </div>
                        </div>
                        <div className="sm:flex-col lg:flex-row sm:ml-5 flex flex-wrap lg:ml-10">
                            <div className="inline-flex flex-wrap lg:pr-10">
                                <h4 className="font-semibold pr-1">Total Supply: </h4>
                                {getNum(total_supply)}
                            </div>
                            <div className="inline-flex flex-wrap">
                                <h4 className="font-semibold pr-1"> Volume: </h4>
                                {getNum(priceData['volume_24h'])}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </motion.button>

    )

}




export default CryptoTab;
