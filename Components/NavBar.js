import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faComments, faHome, faFish, faChartPie, faPoll, faShoppingCart, faDonate } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const NavBar = ({setPage}) => {

    const [menuActive, setMenuActive] = useState(false);
    const menuNotActiveCSS = {width:'50px', height:'50px'};
    const menuActiveCSS = {width:'95%', height:'50px'};

    const variants = {
        notActive: menuNotActiveCSS,
        active: menuActiveCSS
    }

    const menuPressed = () => {
        setMenuActive(!menuActive);
    }

    const buttonStyling = "px-10 whitespace-nowrap"

    return (
    <motion.div 
        className="mt-5 ml-5 sticky flex top-0 absolute rounded-full shadow-xl"
        style={{width:'100%', height:'50px', overflow:'hidden'}}
        variants={variants}
        initial="notActive"
        animate={menuActive ? "active" : "notActive"}
        transition={{ duration: 0.5, tween: 'tween'}} >
            <motion.button className="rounded-full py-3 px-3.5 shadow-lg" 
                whileHover={{ scale:1.1, transition: {duration: 0.2}}}
                onClick={() => {menuPressed()}}
                >
                <FontAwesomeIcon style={{height:'25px', width:'25px'}} icon={faBars} /> 
            </motion.button>
            <motion.button className={buttonStyling}> 
                <FontAwesomeIcon  icon={faHome} /> 
                Home
            </motion.button>
            <motion.button className={buttonStyling} onClick={() => setPage("portfolio")}>
                <FontAwesomeIcon  icon={faChartPie} /> Manage Portfolios 
            </motion.button>
            <motion.button className={buttonStyling} onClick={() => setPage("cryptomarket")}>
                <FontAwesomeIcon  icon={faPoll} /> CryptoMarket Data
            </motion.button>
            <motion.button className={buttonStyling} onClick={() => setPage("whalewatch")}>
                <FontAwesomeIcon  icon={faFish} /> Whale Watch 
            </motion.button>
            <motion.button className={buttonStyling} onClick={() => setPage("chat")}>
                <FontAwesomeIcon  icon={faComments} /> Chat Rooms
            </motion.button>
            <motion.button className={buttonStyling} onClick={() => setPage("marketplace")}>
                <FontAwesomeIcon  icon={faShoppingCart} /> MarketPlace
            </motion.button>
            <motion.button className={buttonStyling} onClick={() => setPage("donation")}>
                <FontAwesomeIcon  icon={faDonate} /> Donate :)
            </motion.button>
    </motion.div>)
}

export default NavBar;