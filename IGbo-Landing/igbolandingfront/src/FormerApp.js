import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import IgboLandingNFT from "./utils/IgboLandingNFT.json";
import { ethers } from 'ethers'


// Constants
const TWITTER_HANDLE = 'Yehana01';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const PIXXITI_LINK  = '';
const TOTAL_MINT_COUNT = 50;
// const CONTRACT_ADDRESS = "0xeDE07330860B19E442983742186eca0C8eF3e399"; // ALCHEMY
const CONTRACT_ADDRESS = "0x465342e9C46f3689fad6154327577C1b7B603b31"; // QUICK_NODE
const goerliChainId = "0x5";

const App = () => {
  // Just a state variable we use to store our user's public wallet.
  const [currentAccount, setCurrentAccount] = useState("");
  const [minting, setMinting] = useState(false);
  const [transactionUrl, setTransactionurl] = useState("");
  const [totalMinted, setTotalMinted] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Check if wallet is connected, make function async
  const checkIfWalletIsConnected = async () =>{
    // Access to window.ethereum
    const { ethereum } = window;

    if(!ethereum){
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // Check for account authorization to user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts'});

    // User can have multiple authorized accounts, grab the first one available
    if(accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Set up a listener, when a user already has their wallet connected to site
      setupEventListener();
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IgboLandingNFT.abi, signer);

      // let nftCount = await connectedContract.getTotalNftMintedSoFar();//need to add to contract
      // setNftMintedSoFar(nftCount.toNumber());
      // console.log("Retriedved Nfts minted so far: ", nftCount.toNumber());

      nftCount = await connectedContract.getMaxNftsToMint();//need to add to contract
      setMaxNftMintCount(nftCount.toNumber());
      console.log("Max number of NFTs to mint: ", nftCount.toNumber());
    }else {
      console.log("No authorized account found");
    }
  }

  // Connect Wallet method
  const connectWallet = async () =>{
    try{
      const { ethereum } = window;
      if(!ethereum){
        alert("Get MetaMask connected");
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId'});
      console.log("Connected to chain " + chainId);
      if(chainId !== goerliChainId){
        alert("You are not connected to the goerli test network!");
        return;
      }
      // Connect account request
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Print out public address once we authorize metamask
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch(error){
      console.log(error);
    }
  }

  // Set up event listener
  const setupEventListener = async () => {
    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IgboLandingNFT.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
      
  }


  const askContractToMintNft = async () =>{

    try {
      const { ethereum } = window;
      if(ethereum){
        let chainId = await ethereum.request({ method: 'eth_chainId '});
        console.log("Connected to chain " + chainId);
        if(chainId !== goerliChainId){
          alert("You are not connected to the goerli test network");
          return;
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, IgboLandingNFT.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnIgboLandingNFT();

        console.log("Mining... please wait.");
        setMinting(true);
        await nftTxn.wait();
        console.log(nftTxn);

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
        setMinting(false);
        let nftCount = await connectedContract.getTotalNftMintedSoFar();
        setNftMintedSoFar(nftCount.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch(error){
      console.log(error);
    }
  }

  // Runs functions when page loads
  useEffect(()=>{
    checkIfWalletIsConnected();
  },[])

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  
  const renderMintUI = () =>(
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      {minting && <span>Minting NFTs...</span>}
      {!minting && <span>Mint NFT</span>}
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            My NFT collection. Learning to create an independent web ecosystem.
          </p>
          <div className="button-container">
            {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
            
            <p className="footer-text">
              {nftMintedSoFar && <span>{nftMintedSoFar}/{maxNftMintCount} NFTs minted</span>}
            </p>
            <button onClick={null} className="cta-button opensea-button">🌊<a
              className="footer-text"
              href={PIXXITI_LINK}
              target="_blank"
              rel="noreferrer"
            >{`View Collection on OpenSea`}</a>
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;