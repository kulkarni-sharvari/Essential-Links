// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IShipment
 * @dev Interface for managing shipments in the supply chain.
 * This interface allows creating and updating consignment details, as well as retrieving the consignment status.
 */
interface IShipment {
  /**
   * @dev Enum representing the different statuses a consignment can have.
   * - TRANSIT: The consignment is in transit.
   * - WAREHOUSE: The consignment is stored in a warehouse.
   * - RETAILER: The consignment has been delivered to the retailer.
   */
  enum ConsignmentStatus {
    TRANSIT,
    WAREHOUSE,
    RETAILER
  }

  /**
   * @dev Structure representing the details of a consignment.
   * @param consignmentId Unique identifier for the consignment.
   * @param batchIds Array of batch IDs included in the consignment.
   * @param carrier Name of the carrier transporting the consignment.
   * @param departureDate Date when the consignment was shipped.
   * @param eta Estimated time of arrival at the destination.
   * @param timestamp The block timestamp when the consignment was created.
   */
  struct Consignment {
    string consignmentId;
    string[] batchIds;
    string carrier;
    string departureDate;
    string eta;
    uint256 timestamp;
  }

  /**
   * @dev Structure representing additional details of a consignment.
   * @param temperature Temperature conditions during transit.
   * @param humidity Humidity conditions during transit.
   * @param timestamp The block timestamp when these details were updated.
   * @param status The current status of the consignment.
   */
  struct OtherDetails {
    string temperature;
    string humidity;
    uint256 timestamp;
    ConsignmentStatus status;
  }

  /**
   * @dev Structure combining consignment details and additional details.
   * @param consignment Basic consignment information.
   * @param otherDetails Additional environmental and status details.
   */
  struct ConsignmentDetails {
    Consignment consignment;
    OtherDetails otherDetails;
  }

  /**
   * @dev Event emitted when a new consignment is created.
   * @param consignmentId Unique identifier for the consignment.
   * @param batchIds Array of batch IDs included in the consignment.
   * @param carrier Name of the carrier transporting the consignment.
   * @param departureDate Date when the consignment was shipped.
   * @param eta Estimated time of arrival at the destination.
   * @param timestamp The block timestamp when the consignment was created.
   */
  event ConsignmentCreated(
    string indexed consignmentId, // Indexing consignmentId for efficient filtering
    string[] batchIds,
    string carrier,
    string departureDate,
    string eta,
    uint256 timestamp
  );

  /**
   * @dev Event emitted when a consignment is updated with new details.
   * @param consignmentId Unique identifier for the consignment.
   * @param temperature Temperature conditions during transit.
   * @param humidity Humidity conditions during transit.
   * @param status The current status of the consignment.
   * @param timestamp The block timestamp when the consignment was updated.
   */
  event ConsignmentUpdated(
    string indexed consignmentId, // Indexing consignmentId for efficient filtering
    string temperature,
    string humidity,
    ConsignmentStatus status,
    uint256 timestamp
  );

  /**
   * @dev Creates a new consignment in the system.
   * @param consignmentId Unique identifier for the consignment.
   * @param batchIds Array of batch IDs included in the consignment.
   * @param carrier Name of the carrier transporting the consignment.
   * @param departureDate Date when the consignment was shipped.
   * @param eta Estimated time of arrival at the destination.
   */
  function createConsignment(
    string calldata consignmentId,
    string[] calldata batchIds,
    string calldata carrier,
    string calldata departureDate,
    string calldata eta
  ) external;

  /**
   * @dev Updates the details of an existing consignment.
   * @param consignmentId Unique identifier for the consignment.
   * @param temperature Temperature conditions during transit.
   * @param humidity Humidity conditions during transit.
   * @param status The current status of the consignment.
   */
  function updateConsignment(string calldata consignmentId, string calldata temperature, string calldata humidity, ConsignmentStatus status) external;

  /**
   * @dev Retrieves the full details of a consignment.
   * @param consignmentId Unique identifier for the consignment.
   * @return A ConsignmentDetails struct containing both basic and additional consignment details.
   */
  function getConsignmentDetails(string calldata consignmentId) external view returns (ConsignmentDetails memory);
}
