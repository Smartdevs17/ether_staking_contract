// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20Staking {
    struct StakingInfo {
        uint256 balance;
        uint256 time;
        uint256 reward;
    }

    mapping(address => StakingInfo) public stakingInfo;
    uint256 public rewardBalance;
    IERC20 public token;

    event StakingStarted(address indexed user, uint256 amount, uint256 stakingTime);
    event RewardsWithdrawn(address indexed user, uint256 amount, uint256 withdrawnTime);

    constructor(address _token) {
        token = IERC20(_token);
    }

    function stakeToken(uint256 _stakingTime) public {
        require(msg.sender != address(0), "Cannot stake from address 0");
        require(_stakingTime > 0, "Staking time must be greater than zero");
        uint256 reward = calculateReward(_stakingTime);
        require(rewardBalance >= reward, "Insufficient reward balance");
        rewardBalance -= reward;
        uint256 amount = token.balanceOf(msg.sender);
        require(amount > 0, "Amount must be greater than zero");
        require(amount <= token.balanceOf(msg.sender), "Amount cannot be greater than the user's balance");
        token.transferFrom(msg.sender, address(this), amount);
        stakingInfo[msg.sender] = StakingInfo(amount, block.timestamp + _stakingTime, reward);

        emit StakingStarted(msg.sender, amount, _stakingTime);
    }

    function calculateReward(uint256 _stakingTime) private pure returns (uint256) {
        uint256 secondsInAYear = 31536000; 
        uint256 reward = _stakingTime / secondsInAYear;
        return reward;
    }

    function withdraw() public {
        require(msg.sender != address(0), "Invalid address");
        require(stakingInfo[msg.sender].balance > 0, "No tokens to withdraw");
        require(block.timestamp >= stakingInfo[msg.sender].time, "Staking time has not elapsed");
        uint256 totalAmount = stakingInfo[msg.sender].balance + stakingInfo[msg.sender].reward;
        stakingInfo[msg.sender].balance = 0;
        stakingInfo[msg.sender].time = 0;
        stakingInfo[msg.sender].reward = 0;
        token.transfer(msg.sender, totalAmount);
        emit RewardsWithdrawn(msg.sender, totalAmount, block.timestamp);
    }
}

// ERC20 Staking Smart Contract

// Objective: Write an ERC20 staking smart contract that allows users to stake a specific ERC20 token for rewards.

// Requirements:
// Users should be able to stake the ERC20 token by transferring the tokens to the contract.
// The contract should track the amount and duration of each user’s stake.
// Implement a reward mechanism similar to the Ether staking contract, where rewards are based on the staking duration.
// Users should be able to withdraw their staked tokens and the rewards after the staking period.
// The contract should handle ERC20 token transfers securely and efficiently.