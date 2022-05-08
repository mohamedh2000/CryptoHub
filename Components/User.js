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

	return (
		<div className="flex flex-col w-1/5 float-right right-0 absolute">
			<button className="rounded-full shadow-xl p-3 w-6" >
				<FontAwesomeIcon icon={faUser} />
			</button>
			<ul className="h-20 rounded-lg shadow-xl p-3 w-2/5">
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
