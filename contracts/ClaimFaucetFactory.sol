// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ClaimFaucet} from"./ClaimFaucet.sol";
import {IERC20} from "./IERC20.sol";

contract ClaimFaucetFactory {  // 0x9E68f8140a99bcE516ca516eA590cE96E45095Db

    struct DeployedContractInfo{
        address deployer;
        address deployedContract;
    }

    mapping (address => DeployedContractInfo[]) allUserDeployedContracts;

    DeployedContractInfo[] allContracts;

    function deployClaimFaucet(string memory _name, string memory _symbol) external returns (address contractAddress_){
        require(msg.sender != address(0), "Zero not allowed");

        address _address = address(new ClaimFaucet(_name, _symbol));

        contractAddress_ = _address;

        DeployedContractInfo memory _deployedContract;
        _deployedContract.deployer = msg.sender;
        _deployedContract.deployedContract = _address;

        allUserDeployedContracts[msg.sender].push(_deployedContract);

        allContracts.push(_deployedContract);
    }

    function getAllContractDeployed() external view returns (DeployedContractInfo[] memory){
        return allContracts;
    }

    function getUserDeployedContract() external view returns (DeployedContractInfo[] memory){
        return allUserDeployedContracts[msg.sender];
    }

    function getUserDeployedContractByIndex(uint8 _index) external view returns (address deployer_, address deployedContract_){
        require(_index < allUserDeployedContracts[msg.sender].length, "Out of bond");

        DeployedContractInfo memory _deployedContract = allUserDeployedContracts[msg.sender][_index];

        deployer_ = _deployedContract.deployer;

        deployedContract_ = _deployedContract.deployedContract;
    }

    function getLengthOfDeployedContract() external view returns (uint256){
        uint256 lens = allContracts.length;
        return lens;
    }

    function getInfoContract(address _claimfaucet) external view returns (string memory, string memory){
        return (
            IERC20(_claimfaucet).getTokenName(),
            IERC20(_claimfaucet).getSymbol()
        );
    }

    function ClaimFaucetFromContract(address _claimfaucet) external {
        IERC20(_claimfaucet).claimToken(msg.sender);
    }
    
    function getBalanceFromDeployedContract(address _claimfaucet) external view returns (uint256) {
        uint256 userBal = IERC20(_claimfaucet).balanceOf(msg.sender);

        return userBal;
    }
}