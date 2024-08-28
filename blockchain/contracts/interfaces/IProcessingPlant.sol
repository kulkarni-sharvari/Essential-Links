// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
 * @title IProcessingPlant
 * @dev Interface for managing processing plants in the supply chain.
 */
interface IProcessingPlant {
  enum PROCESSING_STATUS {
    WITHERING,
    ROLLING,
    FERMENTING,
    DRYING,
    SORTING,
    PACKED
  }

  struct BatchDetails {
    string batchId;
    string harvestId;
    string packetQuantity;
    string[] packetIds;
    uint256 timestamp;
  }

  event ProcessingDetailsUpdated(string harvestId, PROCESSING_STATUS status, uint256 timestamp);
  event BatchCreated(string batchId, string harvestId, string quantity, string[] packetIds, uint256 timestamp);
  event PacketsCreated(string batchId, string[] packetIds, uint256 timestamp);

  function recordProcessing(string calldata harvestId, PROCESSING_STATUS status) external;

  function getProcessingStatus(string calldata harvestId) external view returns (PROCESSING_STATUS);

  function createBatch(string calldata batchId, string calldata harvestId, string calldata quantity, string[] calldata packetIds) external;
}