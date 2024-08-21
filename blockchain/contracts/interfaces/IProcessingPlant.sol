// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title IProcessingPlant - Interface for Processing Plant operations
interface IProcessingPlant {
  enum PROCESSING_STATUS {
    WITHERING,
    ROLLING,
    FERMENTING,
    DRYING,
    SORTING,
    PACKED
  }

  event ProcessingDetailsUpdated(string _harvestId, PROCESSING_STATUS _status, string _timestamp);
  event BatchCreated(string _batchId, string _harvestId, string _quantity, string _timestamp);
  event PacketsCreated(string _batchId, string[] _packetIds, string _timestamp);

  function recordProcessing(string calldata _harvestId, PROCESSING_STATUS _status) external;

  function createBatch(string calldata _batchId, string calldata _harvestId, string calldata _quantity) external;

  function createPackets(string calldata _batchId, string[] calldata _packageIds) external;
}
