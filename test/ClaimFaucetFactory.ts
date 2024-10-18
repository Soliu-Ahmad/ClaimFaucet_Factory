import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("ClaimFaucetFactory Smart Contract Tests", function () {


  async function setupClaimFaucetFactory() {
    const [deployer, user1, user2] = await hre.ethers.getSigners();
    const ClaimFaucetFactory = await hre.ethers.getContractFactory("ClaimFaucetFactory");
    const claimFaucetFactory = await ClaimFaucetFactory.deploy();
    return { claimFaucetFactory, deployer, user1, user2 };
  }

  describe("Factory Deployment", function () {
    it("Should deploy the ClaimFaucetFactory and initialize with no contracts", async function () {
      const { claimFaucetFactory } = await loadFixture(setupClaimFaucetFactory);
      const contractCount = await claimFaucetFactory.getLengthOfDeployedContract();
      expect(contractCount).to.equal(0);
    });
  });

  describe("ClaimFaucet Deployment", function () {
    it("Should deploy a ClaimFaucet contract and verify stored contract info", async function () {
      const { claimFaucetFactory, deployer } = await loadFixture(setupClaimFaucetFactory);
      const name = "VLtToken";
      const symbol = "VLT";

      const tx = await claimFaucetFactory.deployClaimFaucet(name, symbol);
      await tx.wait();

      const index = 0;
      const [deployerAddress, deployedContract] = await claimFaucetFactory.getUserDeployedContractByIndex(index);
      const allContracts = await claimFaucetFactory.getAllContractDeployed();

      expect(allContracts.length).to.equal(1);
      expect(allContracts[index].deployer).to.equal(deployer.address);
      expect(allContracts[index].deployedContract).to.equal(deployedContract);
    });
  });

  describe("getAllContractDeployed Functionality", function () {
    it("Should return all deployed contracts after multiple deployments", async function () {
      const { claimFaucetFactory, user1, user2 } = await loadFixture(setupClaimFaucetFactory);


      await claimFaucetFactory.connect(user1).deployClaimFaucet("DLT Token", "DLT");
      await claimFaucetFactory.connect(user2).deployClaimFaucet("ValoraToken", "VLT");

      const deployedContracts = await claimFaucetFactory.getAllContractDeployed();

      expect(deployedContracts.length).to.equal(2);
      expect(deployedContracts[0].deployer).to.equal(user1.address);
      expect(deployedContracts[1].deployer).to.equal(user2.address);
    });

    it("Should handle cases where no contracts are deployed", async function () {
      const { claimFaucetFactory } = await loadFixture(setupClaimFaucetFactory);

     
      const deployedContracts = await claimFaucetFactory.getAllContractDeployed();
      expect(deployedContracts.length).to.equal(0);
    });
  });

  describe("getUserDeployedContracts Functionality", function () {
    it("Should return all contracts deployed by a specific user", async function () {
      const { claimFaucetFactory, user1 } = await loadFixture(setupClaimFaucetFactory);

     
      await claimFaucetFactory.connect(user1).deployClaimFaucet("Deegen Token", "DT");
      await claimFaucetFactory.connect(user1).deployClaimFaucet("DLT Token", "DLT");

      const userContracts = await claimFaucetFactory.connect(user1).getUserDeployedContract();
      expect(userContracts.length).to.equal(2);
      expect(userContracts[0].deployer).to.equal(user1.address);
      expect(userContracts[1].deployer).to.equal(user1.address);
    });

    it("Should retrieve the correct contract by index", async function () {
      const { claimFaucetFactory, user1 } = await loadFixture(setupClaimFaucetFactory);

      await claimFaucetFactory.connect(user1).deployClaimFaucet("Deegen Token", "DT");
      await claimFaucetFactory.connect(user1).deployClaimFaucet("DLT Token", "DLT");

      const [deployerAddress] = await claimFaucetFactory.connect(user1).getUserDeployedContractByIndex(1);
      expect(deployerAddress).to.equal(user1.address);
    });
  });
});
