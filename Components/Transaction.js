import React from 'react';
import Web3 from 'web3'
import $ from 'jquery';
import {motion} from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

//Props is the transaction 
//w3 is the web3 Object 
const Transaction = ({props, w3, w3Id, currentChain }) => {

    let incomingTransaction = props['to'].trim().toLowerCase() == w3Id.toLowerCase();
    let timeStamp = new Date(0);
    timeStamp.setUTCSeconds(parseInt(props['timeStamp']));
    let options_date = { year: 'numeric', month: 'long', day: 'numeric',
                            hour: 'numeric', minute: 'numeric', second: 'numeric',
                            timeZone: 'America/New_York',
                            timeZoneName: 'short'};
    let timeString = new Intl.DateTimeFormat('en-US', options_date).format(timeStamp);
    
    let to_param = incomingTransaction ? 'You' : props['to'];
    let from_param = !incomingTransaction ? 'You' : props['from'];
    let props_val = (props['value'] && props['value'] != '') ? w3.utils.fromWei(props['value']) : 0;
    let props_contractAdd = props['contractAddress'] != '' ? props['contractAddress'] : 'N/A';
    let props_gasUsed = w3.utils.fromWei(props['cumulativeGasUsed']);
    let isError = parseInt(props['isError']) == 1;
    let trans_hash = props['hash'];
    let tokenSymb = props['tokenSymbol'] ? props['tokenSymbol'] : "ETH";




    //do ether to dollar conversion
    //is failed? 
    //transaction fee 

    const item = {
        hidden: { 
            y: -1000, 
            transition: {
                duration: 0.55, type:'spring'
            }
        },
        show: { 
            y: 0, 
            transition: {
                duration:1, type:'spring'
            } 
        }
    }

    let transactionType = (incomingTransaction ? "text-green-400 " : "text-red-400 ") + "text-lg font-bold tracking-wide w-full" ; 
    let ringTransactionType = (incomingTransaction ? "ring-green-300 " : "ring-red-300 ") + "flex my-4 p-4 rounded-xl ring-2 flex-col w-full"; 

    return (
        <motion.li className={ringTransactionType} 
        variants={item}
        initial="hidden"
        animate="show"
        exit="hidden">
            <h1 className={transactionType}> 
                {isError ? 
                    <FontAwesomeIcon  icon={faExclamationCircle} /> : 
                    <FontAwesomeIcon  icon={faCheckCircle} />} 
                {incomingTransaction ? "IN" : "OUT"} - {tokenSymb}
                <p className="float-right text-base font-light italic text-black" > {timeString} </p> 
            </h1>
            <div>
                {
                    incomingTransaction ?
                        <p> <b>From: </b> {from_param} </p> :
                        <p> <b>To: </b> {to_param} </p>
                }
            </div>
            <div className="flex flex-col w-full">
                {props['tokenID'] ? 
                    <p><b> {props['tokenName']} Minted </b></p>
                    :
                    <p><b>Value: </b> {props_val} {tokenSymb == 'ETH' ? 'Ether' : tokenSymb} </p>                
                }
                <p><b>Total Gas Used: </b> {props_gasUsed} {currentChain == 'ETH' ? 'Ether' : 'BSC'} </p>
                <p><b>Contract Address: </b> {props_contractAdd} </p>
            </div>
            <a className="text-blue-500 mt-5" 
                style={{width:'fit-content'}} target="_blank" 
                href={`${currentChain}/${trans_hash}`} 
                rel="noreferrer">
                    <FontAwesomeIcon className="mr-2" icon={faExternalLinkAlt} /> 
                    {trans_hash}
            </a>
        </motion.li>
    )

}

export default Transaction;
