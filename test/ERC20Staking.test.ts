import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  import {  } from "../typechain-types";

  describe("ERC20Staking", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployTokenFixture() {
      // Deploy SmartDev token
      const SmartDev = await hre.ethers.getContractFactory("SmartDev");
      const token = await SmartDev.deploy();


      return { token };
    }

    async function deployERC20StakingFixture() {
        const { token } = await loadFixture(deployTokenFixture);
        // Deploy ERC20Staking contract
        const ERC20Staking = await hre.ethers.getContractFactory("ERC20Staking");
        const eRC20Staking = await ERC20Staking.deploy(token); 

        // Get signers
        const [owner, user1, user2] = await hre.ethers.getSigners();
  
        return { token, eRC20Staking, owner, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should set the correct token address", async function () {
            const { token, eRC20Staking } = await loadFixture(deployERC20StakingFixture);
            expect(eRC20Staking.token).to.equal(await token.getAddress());
        });

    });

  describe("Staking", function () {
    it("Should allow users to stake tokens", async function () {
        const { eRC20Staking, user1 } = await loadFixture(deployERC20StakingFixture);
        await eRC20Staking.stakeToken(31536000); // stake for 1 year
        expect(await eRC20Staking.stakingInfo(user1.address)).to.not.equal(0);
    });

    it("Should calculate rewards correctly", async function () {
        const { eRC20Staking } = await loadFixture(deployERC20StakingFixture);
        const reward = await eRC20Staking.calculateReward(31536000);
        expect(reward).to.equal(1);
    });

    it("Should allow users to withdraw", async function () {
        const { eRC20Staking, user1 } = await loadFixture(deployERC20StakingFixture);
        await eRC20Staking.stakeToken(31536000); 
        await eRC20Staking.withdraw();
        expect(await eRC20Staking.stakingInfo(user1.address)).to.equal(0);
    });
  });
   

    

  });
