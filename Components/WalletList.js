import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faPlus  } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import User from './User';

const WalletList  = ({w3Id}) => {

	const [visibility, setVisibility] = useState(false);

	const style = {
		walletStyle: "bg-yellow-400 text-white text-base w-full rounded-full font-semibold py-2 px-4 shadow-md" +
                 " hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" +
                 " focus:ring-offset-2 focus:ring-offset-yellow-200 flex-row flex gap-2 ",
		inputStyleHidden: "flex h-1/8 w-full flex-row space-x-2 hidden",
		inputStyleVisible: "flex h-1/8 w-full flex-row space-x-2"
	}

	return (

		<div className="flex h-full w-3/12 flex-col absolute items-center float-left space-y-4">
			<ul className="flex max-h-36 w-full overflow-hidden" style={{marginTop:'20%'}}>
				<li className={style.walletStyle}>
					<p className="overflow-hidden w-4/5"> {w3Id} </p>
					<button className="right-0 float-right">
						<FontAwesomeIcon icon={faTrash} />
					</button>
				</li>
			</ul>
			<div className={(visibility ? style.inputStyleVisible : style.inputStyleHidden)}>
				<input className="flex w-10/12 rounded-full outline-none focus:ring-2 focus:ring-yellow-400" />
				<select name="chain" className="flex w-2/12 rounded-ful focus:outline-none">
					<option value="ETH"> ETH </option>
					<option value="BSC"> BSC </option>
				</select>
				<button>
					<FontAwesomeIcon icon={faCheck} />
				</button>
			</div>
			<button onClick={() => {setVisibility(!visibility)}} className="flex h-1/8 w-full justify-center hover:bg-gray-200 py-4 px-4 shadow-md rounded-full">
				<FontAwesomeIcon icon={faPlus} />
			</button>
		</div>

	)
}

export default WalletList;
