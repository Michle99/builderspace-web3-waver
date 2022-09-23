// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";
import  {Base64}  from "./libraries/Base64.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract IgboLandingNFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Minting Limit
    uint256 public totalMinted = 0;
    uint256 public totalSupply = 50;


    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.
    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

     // I create three arrays, each with their own theme of random words.
    // Pick some random funny words, names of anime characters, foods you like, whatever! 
    string[] firstWords = ["Happy", "Fantastic", "Incredibe", "Awesome", "Mind-blowing", "AbsoluteFuckingAwesome","Joy","Glad","Freedom","Light","Sad","Fatigue","Boredom","Angry","Shy","Content"];
    string[] secondWords = ["Icecream", "Pizza", "Popcorn", "Yogurt", "Spaghetti", "Tacos", "Chick fil-A Sandwich","Spicy South-west salad","Panda Express fried rice","Soy sauce","Amala","Eba","TrailMix","Cranberry Juice","Fried Chicken","Jollof Rice"];
    string[] thirdWords = ["Non-existant", "Life", "Death", "Immortality", "Knowledge", "Understanding", "Simplicity","Wisdom","AGI","Quantum Machines","Quantum Reactors","Multidimensional Energy","Infinite Energy","Global Warming","Zombie Apocalyse","Red Death Virus"];

    // Get fancy with it! Declare a bunch of colors.
    string[] colors = ["red", "#08C2A8", "black", "yellow", "blue", "green"];

    // Events 
    event NewEpicNFTMinted(address sender, uint256 tokenId);

    // We need to pass the name of our NFTs token & its symbol
    constructor() ERC721 ("IgboLandingNFT", "IGBOLANDING") {
        // uint256 _max = maxNftToMint;
        console.log("This NFT is inspired by the Igbo-Landing.");
    }

    // I create a function to randomly pick a word from each array.
    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        // I seed the random generator. More on this in the lesson. 
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        // Squash the # between 0 and the length of the array to avoid going out of bounds.
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    // Same old stuff, pick a random color.
    function pickRandomColor(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("COLOR", Strings.toString(tokenId))));
        rand = rand % colors.length;
        return colors[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(input)));
    }

    // A function our user will hit to get their NFT
    function makeAnIgboLandingNFT() public {
        require(totalMinted < totalSupply, "The total number of NFTs have been minted");
        totalMinted += 1;

        uint256 newItemId = _tokenIds.current();

         // We go and randomly grab one word from each of the three arrays.
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first, second, third));

        // Add random color
        string memory randomColor = pickRandomColor(newItemId);
        // I concatenate it all together, and then close the <text> and <svg> tags.
        string memory finalSvg = string(abi.encodePacked(baseSvg, randomColor, combinedWord, "</text></svg>"));

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "',
                    // We set the title of our NFT as the generated word.
                    combinedWord,
                    '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
        );
        // Just like before, we prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
                abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n--------------------");
        console.log("Final SVG \n");
        console.log(finalSvg);
        console.log("Image Metadata \n");
        console.log(finalTokenUri);
        console.log("NFT Preview \n",
            string(
                abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenUri
                )
            )
        );
        console.log("--------------------\n");

        // Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);
        
        // Upadate the URI
        _setTokenURI(newItemId, finalTokenUri);
        // console.log("An IGBOLANDINGNFT with ID %s has been minted to %s", newItemId, msg.sender);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
         console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

         emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}