// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        //To consume price data, your smart contract should reference AggregatorV3Interface;
        //We need: 1. ABI (To get the ABI, we need the interface)
        //2. Address(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e)/
        //To interact with another external or internal contract ABI and address.
        //In this case we need to reference AggregatorV3Interface which is a function under contract PriceConsumerV3
        //In oder word, to achieve interface, we need ABI and address as shown below
        // Goerli ETH / USD Address
        // https://docs.chain.link/docs/ethereum-addresses/
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        //ETH in terms of USD
        return uint256(price * 1e10); //This is type-casting. //1**10 == 10000000000
    }

    // function getVersion() internal view returns (uint256) {
    //     // ETH/USD price feed address of Goerli Network.
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(
    //         0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
    //     );
    //     return priceFeed.version();
    // }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000; //or 1e18; //We are dividing by 1e18 because ethPrice * ethAmount would give us 1e36
        // the actual ETH/USD conversation rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}
