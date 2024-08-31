import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC20StakingModule = buildModule("ERC20StakingModule", (m) => {
  // Deploy ERC20Staking token first
  const smartDevToken = m.contract("SmartDev");

  // Deploy ERC20Staking contract, passing the smartDev token address
  const eRC20Staking = m.contract("ERC20Staking", [smartDevToken]);

  return { smartDevToken, eRC20Staking };
});

export default ERC20StakingModule;
