import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelescope, faComment, faCode, faBrowser } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faReddit} from '@fortawesome/free-brands-svg-icons';

const MetaDataInfo = ({meta}) => {

	let urls = meta.urls;
	

	return (
		<div className="flex flex-col">
			{
				Object.keys(urls).map((key) => {
					if(urls[key].length != 0) {
						switch(key) {
							case 'chat':
								return (<a target="_blank" href={urls[key][0]}> 
										<FontAwesomeIcon style={{color:'black'}} icon={faComment}/> </a>)
							case 'twitter':
								return (<a target="_blank" href={urls[key][0]}> 
										<FontAwesomeIcon style={{color:'blue'}} icon={faTwitter}/> </a>)
							case 'reddit':
								return (<a target="_blank"  href={urls[key][0]}> 
										<FontAwesomeIcon style={{color:'orange'}} icon={faReddit}/> </a>)
							case 'technical_doc':
								return (<a target="_blank" href={urls[key][0]}> 
										<FontAwesomeIcon icon={faCode}/> </a>)
							default:
								break;
						}
					}
				})
			}

		</div>
	);
}

export default MetaDataInfo;;

