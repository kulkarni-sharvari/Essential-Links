// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IFarmer
 * @dev Interface for managing the harvest details of a farmer.
 * This interface allows recording and retrieving harvest information for farmers.
 */
interface IFarmer {
  /**
   * @dev Structure representing the details of a harvest.
   * @param harvestId Unique identifier for the harvest.
   * @param date The date when the harvest was conducted.
   * @param quality The quality grade of the harvested leaves.
   * @param quantity The quantity of the harvested leaves.
   * @param location The location where the harvest took place.
   * @param farmerId The address of the farmer who conducted the harvest.
   * @param timestamp The block timestamp when the harvest was recorded.
   */
  struct HarvestDetails {
    string harvestId;
    string date;
    string quality;
    string quantity;
    string location;
    address farmerId;
    uint256 timestamp;
  }

  /**
   * @dev Event emitted when a new harvest is recorded.
   * @param harvestId The unique identifier for the harvest.
   * @param date The date when the harvest was conducted.
   * @param quality The quality grade of the harvested leaves.
   * @param quantity The quantity of the harvested leaves.
   * @param location The location where the harvest took place.
   * @param farmerId The address of the farmer who conducted the harvest.
   * @param timestamp The block timestamp when the harvest was recorded.
   */
  event LeavesHarvested(
    string harvestId, // Indexing harvestId for efficient filtering
    string date,
    string quality,
    string quantity,
    string location,
    address farmerId, // Indexing farmerId for efficient filtering
    uint256 timestamp
  );

  /**
   * @dev Records a new harvest on the blockchain.
   * @param harvestId The unique identifier for the harvest.
   * @param date The date when the harvest was conducted.
   * @param quality The quality grade of the harvested leaves.
   * @param quantity The quantity of the harvested leaves.
   * @param location The location where the harvest took place.
   */
  function recordHarvest(
    string calldata harvestId,
    string calldata date,
    string calldata quality,
    string calldata quantity,
    string calldata location
  ) external;

  /**
   * @dev Retrieves the details of a specific harvest.
   * @param harvestId The unique identifier for the harvest.
   * @return A HarvestDetails struct containing the details of the harvest.
   */
  function getHarvestDetails(string calldata harvestId) external view returns (HarvestDetails memory);
}
