import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from 'ethers'
import abi from "./utils/WavePortal.json";
import image from "./yinyang.webp";
import metaMaskIcon from "./metaMask.png";


const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [message, setMessage] = useState("");
  const [mining, setMining] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
  */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x4C11007fDfd9Dd2625E8e7Ff69d2Ee87C2C52A87";

   /*
   * Create a method that gets all waves from your contract
   */
   const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          };
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  // abi content
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
        /*
        * First make sure we have access to window.ethereum
        */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: "eth_accounts" });

      if(accounts.length !== 0){
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
      } catch(error) {
          console.log("There was an error connecting to wallet:", error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
   const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // getAllWaves();

    } catch (error) {
      console.log(error)
    }
  }
  /**
   * Wave function to call the wave function in the 
   * smart contract
  */

    const wave = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

          let count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());

          /**
           * Executing the actual wave from the smart contract
          */
          const waveTxn = await wavePortalContract.wave(message.toString(),{
            gasLimit: 3e5
          });
          
          // Set Mining
          setMining(1);
          console.log("Mining..", waveTxn.hash);

          await waveTxn.wait();
          console.log("Mined --", waveTxn.hash);
          setMining(0);
          setMessage("");

          count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());
        
        } else {
          console.log("Ethereum object doesn't exist!");
          setMining(0);
        }
      } catch (error){
        console.log("There is an error", error);
        setMining(0);
      }
    }


  /*
  * Listen for event emitter
  */
  useEffect(() => {
    checkIfWalletIsConnected();

    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="left">
            <img className="avatar" src={image} alt="pineapple #7098" width="150" height="150"  />
          </div>
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Maikel and I'm learning web3 for the next phase of the web. 
          Connect your Ethereum wallet and wave at me!
        </div>

        {currentAccount && (
          <input className="input"
            type="text"
            placeholder="Say whatever you want"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        )}

        {currentAccount && mining === 0 && (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )}

        {mining !== 0 && (
          <button disabled className="waveButtonDisabled">
            Pending...
          </button>
        )}

        {!currentAccount && (
          <button className="walletButton" onClick={connectWallet}>
            <img className="metaMaskIcon" src={metaMaskIcon}/><span className="cell">Connect Wallet</span>
          </button>
        )}

        {allWaves.map((wave, index) => {
          return(
            <div key={index} className="waveItem">
              <div className="waveInfo">Address: {wave.address}</div>
              <div className="waveInfo">Time: {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(wave.timestamp)}</div>
              <div className="waveMessage">Message: {wave.message}</div>
            </div>  
          )
        })
        }
      </div>
    </div>
  );
}

export default App;