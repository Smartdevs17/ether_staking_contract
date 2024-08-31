// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract EtherStaking {
    struct StakingInfo {
        uint256 balance;
        uint256 time;
        uint256 reward;
    }

    mapping(address => StakingInfo) public stakingInfo;
    uint256 public rewardBalance;

    event StakingStarted(address indexed user, uint256 amount, uint256 stakingTime);
    event RewardsWithdrawn(address indexed user, uint256 amount, uint256 withdrawnTime);

    constructor() payable {
        rewardBalance += msg.value;
    }

    function stakeEther(uint256 _stakingTime) public payable {
        require(msg.value > 0, "Amount must be greater than zero");

        uint256 reward = calculateReward(msg.value, _stakingTime);
        require(rewardBalance >= reward, "Insufficient reward balance");
        
        rewardBalance -= reward;
        stakingInfo[msg.sender] = StakingInfo(msg.value, block.timestamp + _stakingTime, reward);

        emit StakingStarted(msg.sender, msg.value, _stakingTime);
    }

    function calculateReward(uint256 amount, uint256 _stakingTime) public pure returns (uint256) {
        uint256 secondsInAYear = 31536000; 
        uint256 reward = amount * _stakingTime / secondsInAYear;
        return reward;
    }

    function withdraw() public {
        require(msg.sender != address(0), "Invalid address");
        require(stakingInfo[msg.sender].balance > 0, "No Ether to withdraw");
        require(block.timestamp >= stakingInfo[msg.sender].time, "Staking time has not elapsed");
        require(stakingInfo[msg.sender].balance > 0, "User has not staked any Ether");

        uint256 totalAmount = stakingInfo[msg.sender].balance + stakingInfo[msg.sender].reward;
        stakingInfo[msg.sender].balance = 0;
        stakingInfo[msg.sender].time = 0;
        stakingInfo[msg.sender].reward = 0;

        (bool success, ) = payable(msg.sender).call{value: totalAmount}("");
        require(success, "Failed to send Ether");

        emit RewardsWithdrawn(msg.sender, totalAmount, block.timestamp);
    }
}

