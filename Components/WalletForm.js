import React from 'react';
import $ from 'jquery';
import axios from 'axios';

const WalletForm  = ({setVisibility, setAllWallets, visible, userId}) => {

	const addWallet = () => {
		setVisibility(false);
		var selectedChain = $("input[type='radio']:checked").val();
		var inputtedWallet = $("#fwallet").val();
		axios({method: 'post', url: `/api/user/add/${userId}`, data: {'walletId': inputtedWallet, 
			'chain':selectedChain}}).then((res) => {
				setAllWallets(res.data);
			}).catch((e) => {
				console.log(e);
			});
	}

	const style = {
		walletStyle:"cursor-pointer text-white text-base w-full rounded-full font-semibold py-2 px-4 shadow-lg" +
		" hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400" +
		" focus:ring-offset-2 focus:ring-offset-yellow-200 flex-row flex gap-2 ",
		addButtonStyle: "flex h-1/8 w-full justify-center hover:bg-gray-200 p-3 shadow-md rounded-full"
	}

	return (
		<div id="walletForm" style={{'visibility':(visible ? 'visible' : 'hidden'), 'marginTop':'20%'}} className="flex w-8/12 absolute justify-center items-center z-40">
			<div className="flex border-2 flex-col space-y-5 rounded-xl shadow-xl bg-white p-8 pb-10 w-full" >
			<label className="font-extrabold tracking-wide"> Chain </label>
			<div className="flex justify-left space-x-3">
			<div className="form-check form-check-inline">
			<input className="rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="ETH" />
			<label className="form-check-label inline-block tracking-Wider " for="inlineRadio1">ETH</label>
			</div>
			<div className="form-check form-check-inline">
			<input className="rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="BSC" />
			<label className="form-check-label tracking-wider inline-block" for="inlineRadio20">BSC</label>
			</div>
			</div>
			<label for="fwallet" className="font-extrabold tracking-wide"> Wallet ID </label>
			<input id="fwallet" className="rounded-xl outline-none shadow-lg p-2" type="text" /><br/>

			<button value="Add Wallet" onClick={() => addWallet()} className={style.addButtonStyle + " bg-yellow-300 hover:bg-yellow-400"} > Add Wallet </button>

			<button className={style.addButtonStyle  + " bg-red-300 hover:bg-red-400"} value="cancel" onClick={() => setVisibility(false)} > Cancel </button>
			<button className={style.addButtonStyle} >
			<img style={{width:"50px"}} src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" />
			</button>
			</div>
		</div>
	)
}

export default WalletForm;
