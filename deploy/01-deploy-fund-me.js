const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
//require("dotenv").config();

//In hardhat deploy, we would not be having main function or calling a function
//When we run hardhat deploy, it would call any function we specify
// async function deployFunc(hre){
// console.log("Hi");
// hre.getNamedAccounts();
// hre.deployments;
// //}
// module.exports.default = deployFunc

//module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre;
// };

const { networkConfig } = require("../helper-hardhat-config");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    //if chainId is X, we use address Y
    //if chainId is B, we use address A
    let ethUsdPriceFeedAddress;
    const chainId = network.config.chainId;
    //if (chainId == 31337){
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    log("----------------------------------------------------");
    log("Deploying FundMe and waiting for confirmations...");

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    });

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }
    log("----------------------------------------");
};
module.exports.tags = ["all", "fundme"];
