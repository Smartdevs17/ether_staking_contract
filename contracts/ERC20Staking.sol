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
    IERC20 public token;
    address private owner;
    uint256 public rewardBalance = token.balanceOf(owner);

    event StakingStarted(address indexed user, uint256 amount, uint256 stakingTime);
    event RewardsWithdrawn(address indexed user, uint256 amount, uint256 withdrawnTime);

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    function stakeToken(uint256 _stakingTime, uint256 _amount) public {
        require(msg.sender != address(0), "Cannot stake from address 0");
        require(_stakingTime > 0, "Staking time must be greater than zero");
        uint256 reward = calculateReward(_stakingTime, _amount);
        require(rewardBalance >= reward, "Insufficient reward balance");
        rewardBalance -= reward;
        require(_amount > 0, "Amount must be greater than zero");
        require(_amount <= token.balanceOf(msg.sender), "Amount cannot be greater than the user's balance");
        token.transferFrom(msg.sender, address(this), _amount);
        stakingInfo[msg.sender] = StakingInfo(_amount, block.timestamp + _stakingTime, reward);

        emit StakingStarted(msg.sender, _amount, _stakingTime);
    }

    function calculateReward(uint256 _stakingTime, uint256 _amount) public pure returns (uint256) {
        uint256 secondsInAYear = 31536000; 
        uint256 reward = _amount * _stakingTime * 1e18 / secondsInAYear;
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