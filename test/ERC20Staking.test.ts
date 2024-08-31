import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20Staking", function () {
    async function deployTokenFixture() {
        const SmartDev = await ethers.getContractFactory("SmartDev");
        const token = await SmartDev.deploy();
        return { token };
    }

    async function deployERC20StakingFixture() {
        const { token } = await loadFixture(deployTokenFixture);
        const ERC20Staking = await ethers.getContractFactory("ERC20Staking");
        const eRC20Staking = await ERC20Staking.deploy(token);  
        const [owner, user1, user2] = await ethers.getSigners();
        const rewardAmount = ethers.parseEther("100.0");

        await token.transfer(await eRC20Staking.getAddress(), rewardAmount);
        const contractBalance = await token.balanceOf(await eRC20Staking.getAddress());
        // console.log(`Contract balance: ${contractBalance.toString()}`);

        return { token, eRC20Staking, owner, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should set the correct token address", async function () {
            const { token, eRC20Staking } = await loadFixture(deployERC20StakingFixture);
            expect(await eRC20Staking.token()).to.equal(await token.getAddress());
        });
    });

    describe("Staking", function () {
        it("Should allow staking with correct parameters", async function () {
            const { eRC20Staking, owner, user1, token } = await loadFixture(deployERC20StakingFixture);
            const stakingTime = 120; 
            const userToken = ethers.parseEther("20.0");
        
            await token.transfer(user1.address, userToken);
            const amount = ethers.parseEther("1.0");
            await token.connect(user1).approve(await eRC20Staking.getAddress(), amount);
        
            await eRC20Staking.connect(user1).stakeToken(stakingTime, amount);
        
            const stakingInfo = await eRC20Staking.stakingInfo(user1.address);
        
            expect(stakingInfo).to.not.be.null;
            expect(stakingInfo!.balance).to.equal(amount); 
            // expect(stakingInfo!.time).to.equal(stakingTime + (await ethers.provider.getBlock('latest')).timestamp);
        });
        

        // it("Should not allow staking with invalid parameters", async function () {
        //     const { eRC20Staking, user1, token } = await loadFixture(deployERC20StakingFixture);
        //     const stakingTime = 0; 
        //     const amount = ethers.parseEther("1.0"); // 1 token

        //     await token.mint(user1.address, amount);
        //     await token.connect(user1).approve(eRC20Staking.address, amount);

        //     await expect(eRC20Staking.connect(user1).stakeToken(stakingTime, amount)).to.be.revertedWith("Staking time must be greater than zero");
        // });
    });

    // describe("Withdrawal", function () {
    //     it("Should allow withdrawal after staking time", async function () {
    //         const { eRC20Staking, user1, token } = await loadFixture(deployERC20StakingFixture);
    //         const stakingTime = 31536000; // 1 year in seconds
    //         const amount = ethers.parseEther("1.0"); // 1 token

    //         await token.mint(user1.address, amount);
    //         await token.connect(user1).approve(eRC20Staking.address, amount);
    //         await eRC20Staking.connect(user1).stakeToken(stakingTime, amount);

    //         await ethers.provider.send("evm_increaseTime", [stakingTime]);
    //         await ethers.provider.send("evm_mine", []);

    //         await eRC20Staking.connect(user1).withdraw();

    //         const user1Balance = await token.balanceOf(user1.address);
    //         expect(user1Balance).to.equal(amount.mul(2)); 
    //     });

    //     it("Should not allow withdrawal before staking time", async function () {
    //         const { eRC20Staking, user1, token } = await loadFixture(deployERC20StakingFixture);
    //         const stakingTime = 31536000; // 1 year in seconds
    //         const amount = ethers.parseEther("1.0"); // 1 token

    //         await token.mint(user1.address, amount);
    //         await token.connect(user1).approve(eRC20Staking.address, amount);
    //         await eRC20Staking.connect(user1).stakeToken(stakingTime, amount);

    //         await expect(eRC20Staking.connect(user1).withdraw()).to.be.revertedWith("Staking time has not elapsed");
    //     });
    // });
});
