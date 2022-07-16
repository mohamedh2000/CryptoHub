import React, {useEffect, useState, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faPlus} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const WalletList  = ({setVisibility, allWallets, changeWallet, currentWallet, deleteWallet, refreshWallet}) => {

	const style = {
		walletStyle:"cursor-pointer text-white text-base w-full rounded-full font-semibold py-2 px-4 shadow-lg" +
		" hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" +
		" focus:ring-offset-2 focus:ring-offset-yellow-200 flex-row flex gap-2 ",
		addButtonStyle: "flex h-1/8 w-full justify-center hover:bg-gray-200 py-4 px-4 shadow-md rounded-full"
	}

	return (
		<div className="flex h-full w-full">
		<div className="flex h-full w-3/12 flex-col absolute items-center float-left space-y-4">
		<ul className="flex flex-col space-y-10 max-h-36 w-full" style={{marginTop:'20%'}}>
		{
			allWallets.map((walletId) => 
				<li key={walletId} style={{'display':'block'}} onClick={() => changeWallet(walletId)} 
				className={walletId == currentWallet ? 
					(style.walletStyle + " bg-yellow-400") : 
					(style.walletStyle + " bg-yellow-200")}>
				<p className="inline-block overflow-hidden w-4/5 text-md"> {walletId} </p>
				
				{walletId == currentWallet ? 
					<div className="float-right right-0 space-x-3">
						<button className="inline-block" onClick={() => refreshWallet()}>
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="auto" 
							fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
							<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
							</svg>
						</button>
						<button className="inline-block" onClick={() => deleteWallet()}>
							<svg xmlns="http://www.w3.org/2000/svg" width="25" height="auto" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
							<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
							</svg>
						</button>
					</div>
					: <></>}
				</li>

			)	
		}
		<button onClick={() => setVisibility(true)} 
		className={style.addButtonStyle}>
		<FontAwesomeIcon icon={faPlus} />
		</button>

		</ul>
		</div>	
		</div>
	)
}


export default WalletList;
