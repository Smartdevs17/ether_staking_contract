import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import { ethers } from "hardhat";

  describe("EtherStaking", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployEtherStakingFixture() {
        // Deploy EtherStaking contract with Ether to set the payable reward balance
        const EtherStaking = await ethers.getContractFactory("EtherStaking");
        const etherStaking = await EtherStaking.deploy({ value: ethers.parseEther("100.0") }); // Deploy with 1 Ether to set the reward balance

        // Get signers
        const [user1, user2] = await ethers.getSigners();
  
        return {etherStaking, user1, user2 };
    }

  describe("Deployment", function () {
    it("Should deploy the contract successfully", async function () {
        const { etherStaking } = await loadFixture(deployEtherStakingFixture);
        expect(etherStaking).to.be.ok;
    });
  });

  describe("Staking", function () {
    it("Should allow users to stake", async function () {
        const { etherStaking, user1 } = await loadFixture(deployEtherStakingFixture);
        const stakeAmount = ethers.parseEther("1"); // 1 Ether
    
        await etherStaking.connect(user1).stakeEther(31536000, { value: stakeAmount }); // Stake for 1 year
        expect(await etherStaking.rewardBalance()).to.be.above(0);
    });
    

    it("Should calculate rewards correctly", async function () {
        const { etherStaking } = await loadFixture(deployEtherStakingFixture);
        const reward = await etherStaking.calculateReward(1, 31536000);
        expect(reward).to.equal(1);
    });

    it("Should not allow the users to withdraw when time has not elapsed", async function () {
        const { etherStaking, user1 } = await loadFixture(deployEtherStakingFixture);
        const stakeAmount = ethers.parseEther("1"); 
        await etherStaking.connect(user1).stakeEther(120, { value: stakeAmount }); 
        await expect(etherStaking.connect(user1).withdraw()).to.be.revertedWith("Staking time has not elapsed");
        expect(await etherStaking.rewardBalance()).to.be.above(0);
    });

    it("Should not allow users without stake to withdraw", async function () {
        const { etherStaking, user2 } = await loadFixture(deployEtherStakingFixture);
        await expect(etherStaking.connect(user2).withdraw()).to.be.revertedWith("No Ether to withdraw");
    });

    it("Should allow users to withdraw after time elapsed", async function () {
        const { etherStaking, user1 } = await loadFixture(deployEtherStakingFixture);
        const stakeAmount = ethers.parseEther("1"); 
        
        await etherStaking.connect(user1).stakeEther(120, { value: stakeAmount }); 
        await ethers.provider.send("evm_increaseTime", [120]);
        await ethers.provider.send("evm_mine", []); 
    
        await etherStaking.connect(user1).withdraw();
        
        const currentRewardBalance = await etherStaking.rewardBalance();
        expect(currentRewardBalance).to.be.below(ethers.parseEther("100"));
    });
    
  });

  });
