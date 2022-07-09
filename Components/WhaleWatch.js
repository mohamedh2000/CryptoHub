import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faComments, faHome, faFish, faChartPie, faPoll, faShoppingCart, faDonate, faUser } 
	from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'

const WhaleWatch = () => {
	useEffect(() => {
		axios('/api/blockchain/metrics').then(() => {
			console.log("im in here");
		});
	}, []);
    return (
	   <div >
		</div>
    )
}

export default WhaleWatch;
