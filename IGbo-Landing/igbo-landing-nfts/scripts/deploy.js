const main = async()=>{
    const IgboLandingNftContractFactory = await hre.ethers.getContractFactory('IgboLandingNFT');
    const IgboLandingNftContract = await IgboLandingNftContractFactory.deploy();
    await IgboLandingNftContract.deployed();
    console.log("Contract deployed to:", IgboLandingNftContract.address);


    // Call makeAnIgboLandingNFT function
    let txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #1");

    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #2");

    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #3");
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #4");
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #5");
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #6");
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #7");
    txn = await IgboLandingNftContract.makeAnIgboLandingNFT();
    // Wait for it to be mined
    await txn.wait();
    console.log("Minted IGBOLANDINFNFT #8");
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