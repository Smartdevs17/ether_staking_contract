import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EtherStakingModule = buildModule("EtherStakingModule", (m) => {
  // Deploy EtherStaking contract
  const etherStaking = m.contract("EtherStaking");

  return { etherStaking };
});

export default EtherStakingModule;
