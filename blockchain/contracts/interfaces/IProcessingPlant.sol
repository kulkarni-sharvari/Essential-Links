// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IProcessingPlant
 * @dev Interface for managing processing plants in the supply chain.
 * This interface allows recording processing steps, creating batches, and managing packets within the supply chain.
 */
interface IProcessingPlant {
  /**
   * @dev Enum representing the different stages of processing.
   * - WITHERING: Initial stage of drying the leaves.
   * - ROLLING: Rolling the leaves to break down the structure.
   * - FERMENTING: Allowing leaves to oxidize.
   * - DRYING: Further drying of the leaves after fermentation.
   * - SORTING: Sorting the leaves by quality and size.
   * - PACKED: Final stage where leaves are packed into packets.
   */
  enum ProcessingStatus {
    WITHERING,
    ROLLING,
    FERMENTING,
    DRYING,
    SORTING,
    PACKED
  }

  /**
   * @dev Structure representing the details of a batch created during processing.
   * @param batchId Unique identifier for the batch.
   * @param harvestId Identifier of the related harvest.
   * @param packetQuantity Quantity of packets produced in this batch.
   * @param packetIds Array of packet IDs produced in this batch.
   * @param timestamp The block timestamp when the batch was created.
   */
  struct BatchDetails {
    string batchId;
    string harvestId;
    string packetQuantity;
    string[] packetIds;
    uint256 timestamp;
  }

  /**
   * @dev Event emitted when the processing details of a harvest are updated.
   * @param harvestId Identifier of the related harvest.
   * @param status Current processing status.
   * @param timestamp The block timestamp when the processing status was updated.
   */
  event ProcessingDetailsUpdated(
    string indexed harvestId, // Indexing harvestId for efficient filtering
    ProcessingStatus status,
    uint256 timestamp
  );

  /**
   * @dev Event emitted when a new batch is created.
   * @param batchId Unique identifier for the batch.
   * @param harvestId Identifier of the related harvest.
   * @param quantity Quantity of packets produced in this batch.
   * @param packetIds Array of packet IDs produced in this batch.
   * @param timestamp The block timestamp when the batch was created.
   */
  event BatchCreated(
    string indexed batchId, // Indexing batchId for efficient filtering
    string indexed harvestId, // Indexing harvestId for efficient filtering
    string quantity,
    string[] packetIds,
    uint256 timestamp
  );

  /**
   * @dev Event emitted when packets are created during batch processing.
   * @param batchId Unique identifier for the batch.
   * @param packetIds Array of packet IDs created in this batch.
   * @param timestamp The block timestamp when the packets were created.
   */
  event PacketsCreated(
    string indexed batchId, // Indexing batchId for efficient filtering
    string[] packetIds,
    uint256 timestamp
  );

  /**
   * @dev Records the processing status of a specific harvest.
   * @param harvestId Identifier of the related harvest.
   * @param status Current processing status to be recorded.
   */
  function recordProcessing(string calldata harvestId, ProcessingStatus status) external;

  /**
   * @dev Retrieves the current processing status of a specific harvest.
   * @param harvestId Identifier of the related harvest.
   * @return The current processing status.
   */
  function getProcessingStatus(string calldata harvestId) external view returns (ProcessingStatus);

  /**
   * @dev Creates a new batch after processing is complete.
   * @param batchId Unique identifier for the batch.
   * @param harvestId Identifier of the related harvest.
   * @param quantity Quantity of packets produced in this batch.
   * @param packetIds Array of packet IDs produced in this batch.
   */
  function createBatch(string calldata batchId, string calldata harvestId, string calldata quantity, string[] calldata packetIds) external;
}
