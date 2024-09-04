// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title IUser
 * @dev Interface for managing users in the supply chain.
 * This interface allows registering users with different roles and retrieving their details.
 */
interface IUser {
  /**
   * @dev Enum representing the different roles a user can have in the supply chain.
   * - FARMER: User responsible for growing and harvesting crops.
   * - PROCESSING_PLANT: User responsible for processing the harvested crops.
   * - SHIPMENT: User responsible for transporting the processed goods.
   * - RETAILER: User responsible for selling the final product to consumers.
   */
  enum ROLE {
    ADMIN,
    FARMER,
    PROCESSING_PLANT,
    SHIPMENT,
    RETAILER
  }

  /**
   * @dev Structure representing the details of a user.
   * @param userId Unique identifier for the user.
   * @param accountAddress Address of the user's account.
   * @param role The role assigned to the user in the supply chain.
   * @param timestamp The block timestamp when the user was registered.
   */
  struct User {
    string userId;
    address accountAddress;
    ROLE role;
    uint256 timestamp;
  }

  /**
   * @dev Event emitted when a new user is registered.
   * @param accountAddress Address of the user's account.
   * @param userId Unique identifier for the user.
   * @param role The role assigned to the user.
   * @param timestamp The block timestamp when the user was registered.
   */
  event UserRegistered(
    address accountAddress, // Indexing accountAddress for efficient filtering
    string userId,
    ROLE role,
    uint256 timestamp
  );

  /**
   * @dev Registers a new user in the system.
   * @param accountAddress Address of the user's account.
   * @param userId Unique identifier for the user.
   * @param role The role assigned to the user.
   */
  function registerUser(address accountAddress, string calldata userId, ROLE role) external;

  /**
   * @dev Retrieves the details of a specific user.
   * @param accountAddress Address of the user's account.
   * @return A User struct containing the user's details.
   */
  function getUserDetails(address accountAddress) external view returns (User memory);
}
