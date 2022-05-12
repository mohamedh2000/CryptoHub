import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSession, signIn, signOut } from "next-auth/react"

//Props is the transaction 
//w3 is the web3 Object 
const User = () => {
	const [userEmail, setUserEmail] = useState([]);
	const { data: session, status } = useSession();
	const [visibility, setVisibility] = useState(false);
	const states = {
		LOADING: 'loading', 
		AUTH: 'authenticated',
		UNAUTH: 'unauthenticated'
	}
	
	useEffect(() => {
		if(session) {
			setUserEmail(session.user.email);						
		}
	}, [session]);

	const style = {
		hiddenDropDown: "h-20 hidden rounded-lg shadow-xl p-3 w-full",
		visibleDropDown: "h-20 rounded-lg shadow-xl p-3 w-full"
	}

	return (
		<div className="flex flex-col w-1/5 absolute right-10 items-end">
			<button onClick={() => setVisibility(!visibility)} className="rounded-full shadow-xl p-3 w-6" >
				<FontAwesomeIcon icon={faUser} />
			</button>
			<ul className={(visibility ? style.visibleDropDown : style.hiddenDropDown)}>
				{
					(status == states.AUTH ? 
						<b> Hello! {session.user.email} </b>
						:
						<button onClick={() => 
							{signIn()}}> Login </button> 
					)
					}
			</ul>
		</div>
	);
};

export default User;
