import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";

  describe("EtherStaking", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.

    async function deployEtherStakingFixture() {
        // Deploy EtherStaking contract
        const EtherStaking = await hre.ethers.getContractFactory("EtherStaking");
        const etherStaking = await EtherStaking.deploy(); 

        // Get signers
        const [user1, user2] = await hre.ethers.getSigners();
  
        return {etherStaking, user1, user2 };
    }

  });
