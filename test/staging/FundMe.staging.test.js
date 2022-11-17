const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");
//Unit test only runs on the development chains and staging test only runs on testnet
developmentChains.includes(network.name)
    ? describe.skip // if we are on the development, skip the test else, run the test.
    : describe("FundMe", async function () {
          let FundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("1");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContracts("FundMe", deployer);
          });

          it("allows people to fund amd withdraw", async function () {
              await fundMe.fund({ value: sendValue });
              await fundMe.withdraw();
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );

              assert.equal(endingBalance.toString(), "0");
          });
      });
