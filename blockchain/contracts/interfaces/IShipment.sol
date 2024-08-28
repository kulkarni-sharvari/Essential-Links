// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
 * @title IShipment
 * @dev Interface for managing shipments in the supply chain.
 */
interface IShipment {
  enum ConsignmentStatus {
    TRANSIT,
    WAREHOUSE,
    RETAILER
  }

  struct Consignment {
    string consignmentId;
    string[] batchIds;
    string carrier;
    string departureDate;
    string eta;
    uint256 timestamp;
  }

  struct OtherDetails {
    string temperature;
    string humidity;
    uint256 timestamp;
    ConsignmentStatus status;
  }

  struct ConsignmentDetails {
    Consignment consignment;
    OtherDetails otherDetails;
  }

  event ConsignmentCreated(string consignmentId, string[] batchIds, string carrier, string departureDate, string eta, uint256 timestamp);
  event ConsignmentUpdated(string consignmentId, string temperature, string humidity, ConsignmentStatus status, uint256 timestamp);

  function createConsignment(
    string calldata consignmentId,
    string[] calldata batchIds,
    string calldata carrier,
    string calldata departureDate,
    string calldata eta
  ) external;

  function updateConsignment(string calldata consignmentId, string calldata temperature, string calldata humidity, ConsignmentStatus status) external;

  function getConsignmentDetails(string calldata consignmentId) external view returns (ConsignmentDetails memory);
}