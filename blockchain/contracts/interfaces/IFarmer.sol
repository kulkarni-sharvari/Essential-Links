// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IFarmer
 * @dev Interface for managing the harvest details of a farmer.
 */
interface IFarmer {
  struct HarvestDetails {
    string harvestId;
    string date;
    string quality;
    string quantity;
    string location;
    address farmerId;
    uint256 timestamp;
  }

  event LeavesHarvested(string harvestId, string date, string quality, string quantity, string location, address farmerId, uint256 timestamp);

  function recordHarvest(
    string calldata harvestId,
    string calldata date,
    string calldata quality,
    string calldata quantity,
    string calldata location
  ) external;

  function getHarvestDetails(string calldata harvestId) external view returns (HarvestDetails memory);
}