import React, {useEffect, useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import WalletForm from './WalletForm.js';
import User from './User';

const WalletList  = ({setVisibility, w3Id}) => {

	const style = {
		walletStyle: "bg-yellow-400 text-white text-base w-full rounded-full font-semibold py-2 px-4 shadow-md" +
		" hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" +
		" focus:ring-offset-2 focus:ring-offset-yellow-200 flex-row flex gap-2 ",
	}

	return (
		<div className="flex h-full w-full">
			<div className="flex h-full w-3/12 flex-col absolute items-center float-left space-y-4">
				<ul className="flex max-h-36 w-full overflow-hidden" style={{marginTop:'20%'}}>
					<li className={style.walletStyle}>
						<p className="overflow-hidden w-4/5"> {w3Id} </p>
						<button className="right-0 float-right">
							<FontAwesomeIcon icon={faTrash} />
						</button>
					</li>
				</ul>
				<button onClick={() => setVisibility(true)} className="flex h-1/8 w-full justify-center hover:bg-gray-200 py-4 px-4 shadow-md rounded-full">
					<FontAwesomeIcon icon={faPlus} />
				</button>
			</div>
		</div>
	)
}

export default WalletList;
