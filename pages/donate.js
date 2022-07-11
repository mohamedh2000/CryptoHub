import React, {useEffect, useRef} from 'react';
import Web3 from 'web3';
import $ from 'jquery';
import axios from 'axios'

export const Donation = () => {
	const smartCAddress = process.env.SMART_CONTRACT;
	let web3;
	if(Web3.givenProvider) {
		web3 = new Web3(window.ethereum);
		web3.eth.getAccounts().then((acc) => {
			web3.eth.defaultAccount = acc[0]
		})
	}
	let onePrice = useRef();

	useEffect(() => {
		axios(`/api/crypto/symbol/ONE`).then((coinData) => {
			onePrice.current = coinData.data.data.ONE.quote.USD.price.toFixed(2);
		})      
	}, [])

	

	const donateToPerson = () => {
		let donateAmount = $("#donateNum").val() * 1e18;
		let options = {
			to: smartCAddress,
			value: donateAmount.toString()
		};
		web3.eth.sendTransaction(options);
	}

	const getUsdValue = () => {
		let oneAmount = $("#donateNum").val();
		$("#donateNumUsd").val((oneAmount * onePrice.current).toFixed(2));
	}

	const getOneValue = () => {
		let usdValue = $("#donateNumUsd").val();
		$("#donateNum").val((usdValue / onePrice.current).toFixed(2));
	}

	return (
		<div className='w-full h-full flex mt-10' >
		<div className="flex flex-col w-full" style={{ marginTop: '30%', marginLeft: '40%' }}>
		<input onChange={() => { getOneValue() }} type="number" id="donateNumUsd" className="outline-none focus:ring-2 focus:ring-yellow-200 mb-10 text-center rounded-xl shadow-xl p-2" placeHolder="Amount in USD" style={{ width: '50%' }} />
		<input onChange={() => { getUsdValue() }} type="number" id="donateNum" className="outline-none focus:ring-2 focus:ring-yellow-200 mb-10 rounded-xl text-center shadow-xl p-2" placeHolder="Amount of ONE" style={{ width: '50%' }} />
		<button className="rounded-xl shadow-xl p-2 ring-4 ring-yellow-200" onClick={() => donateToPerson()} style={{ width: '50%' }}> Donate</button>
		<p className="mt-5"> <i>Every donation is much appreciated! :)</i> </p>
		</div>
		</div>
)

}

export default Donation;
