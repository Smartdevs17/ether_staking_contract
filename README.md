# Dual Smart Contract Project: ERC20 Staking and Ether Staking

This project is a comprehensive demonstration of two advanced smart contracts: ERC20 Staking and Ether Staking. It includes both contracts, along with their respective tests to ensure functionality, and utilizes Hardhat Ignition modules to streamline the deployment process.

### ERC20 Staking Contract

The ERC20 staking contract allows users to stake a specific ERC20 token in exchange for rewards, with the reward amount based on the duration of the stake. The contract securely handles ERC20 token transfers and tracks the amount and duration of each user's stake. Users can withdraw their staked tokens and rewards after the staking period has elapsed.

### Ether Staking Contract

The Ether staking contract is designed to allow users to stake Ether, providing a basic staking mechanism. This contract serves as a foundational example of staking functionality within the Ethereum ecosystem.

### Getting Started

To explore and interact with these smart contracts, try running the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/ERC20Staking.ts
npx hardhat ignition deploy ./ignition/modules/EtherStaking.ts
```

These commands will provide you with information on available tasks, run tests to verify the contracts' functionality, simulate a local blockchain network, and deploy both the ERC20 staking and Ether staking contracts using their respective Hardhat Ignition modules.
