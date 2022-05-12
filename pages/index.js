import {useEffect, useState} from 'react';
import CryptoMarket from './cryptomarket';
import Donation from './donate';
import NavBar from '../Components/NavBar.js';
import Portfolio from '../Components/Portfolio.js'
import '../styles/Home.module.css';
import MarketPlace from '../Components/MarketPlace.js';
import { Redis } from '@upstash/redis'; 

export default function Home() {

  const [home, setHome] = useState(false);
  const [portfolio, setPortfolio] = useState(false);
  const [cryptoMarket, setCryptoMarket] = useState(true);
  const [marketplace, setMarketplace] = useState(false);
  const [donation, setDonation] = useState(false);
  const [chatRoom, setChatRoom] = useState(false);
  const [whaleWatch, setWhaleWatch] = useState(false);

  const setPage = (page) => {
      if(page == "home") {
        setHome(true);
        setPortfolio(false);
        setCryptoMarket(false);
        setMarketplace(false);
        setDonation(false);
        setChatRoom(false);
        setWhaleWatch(false);
      }
      else if(page == "portfolio") {
        setHome(false);
        setPortfolio(true);
        setCryptoMarket(false);
        setMarketplace(false);
        setDonation(false);
        setChatRoom(false);
        setWhaleWatch(false);
      }
      else if (page == 'cryptomarket') {
        setHome(false);
        setPortfolio(false);
        setCryptoMarket(true);
        setMarketplace(false);
        setDonation(false);
        setChatRoom(false);
        setWhaleWatch(false);
      }
      else if (page == "marketplace") {
        setHome(false);
        setPortfolio(false);
        setCryptoMarket(false);
        setMarketplace(true);
        setDonation(false);
        setChatRoom(false);
        setWhaleWatch(false);
      }
      else if(page == "chat") {
        setHome(false);
        setPortfolio(false);
        setCryptoMarket(false);
        setMarketplace(false);
        setDonation(false);
        setChatRoom(true);
        setWhaleWatch(false);
      }
      else if(page == "whalewatch") {
        setHome(false);
        setPortfolio(false);
        setCryptoMarket(false);
        setMarketplace(false);
        setDonation(false);
        setChatRoom(false);
        setWhaleWatch(true); 
      }
      else { 
        setHome(false);
        setPortfolio(false);
        setCryptoMarket(false);
        setMarketplace(false);
        setDonation(true);
        setChatRoom(false);
        setWhaleWatch(false);
      }
  }


  return (
    <div className="flex flex-col">
	  <NavBar setPage={setPage}/>
        <div style={{height:'80%', marginTop:'5%'}}>
      {
        (cryptoMarket ? <CryptoMarket /> :
           donation ? <Donation /> : 
           marketplace ? <MarketPlace /> :
           <Portfolio />
          )
      }
      </div>
    </div>
  )
}
