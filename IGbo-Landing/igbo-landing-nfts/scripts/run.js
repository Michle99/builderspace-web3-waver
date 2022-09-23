const main = async()=>{
    const IgboLandingNftContractFactory = await hre.ethers.getContractFactory('IgboLandingNFT');
    const IgboLandingNftContract = await IgboLandingNftContractFactory.deploy();
    await IgboLandingNftContract.deployed();
    console.log("Contract deployed to:", IgboLandingNftContract.address);

    // Call the function
    let txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // wait for it to be mined
    await txn.wait();

    // Mint another NFT for fun
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    // Mint another NFT for fun
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    // Mint another NFT for fun
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    // Mint another NFT for fun
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    // Mint another NFT for fun
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    // Mint another NFT for fun
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
};

const runMain = async()=>{
    try{
        await main();
        process.exit(0);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
};

runMain();