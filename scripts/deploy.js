//Prettier - Code formatter extension is used for different languages like js, python and solidity
//import
const { verifyMessage } = require("ethers/lib/utils");
const { ethers, run, network } = require("hardhat"); //Here we are importing the ether from hardhat
require("dotenv").config();
//const fs = require("fs-extra"); //This is to read from the abi and bin files. (Use yarn add fs-extra to install it)
//require("dotenv").config(); //This is for the code to see what is in the .env file

//async function
async function main() {
    //Deploying the contract
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );
    console.log("Deploying contract, please wait...");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log(`Deployed contract to: ${simpleStorage.address}`);

    //What happens when we deploy to our hardhat network?
    //Verifying the contract
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...");
        await simpleStorage.deployTransaction.wait(6); //Wait six blocks
        await verify(simpleStorage.address, []);
    }

    //Interacting with the contract:
    //Set the current value
    const currentValue = await simpleStorage.retrieve();
    console.log(`Current Value is: ${currentValue}`);

    //Update the current value
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated Value is: ${updatedValue}`);
}

// const verify = async (contractAddress, args) => {
async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
