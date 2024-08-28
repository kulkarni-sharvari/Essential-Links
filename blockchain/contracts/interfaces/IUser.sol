// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IUser
 * @dev Interface for managing users in the supply chain.
 */
interface IUser {
  enum ROLE {
    FARMER,
    PROCESSING_PLANT,
    SHIPMENT,
    RETAILER
  }

  struct User {
    string userId;
    address accountAddress;
    ROLE role;
    uint256 timestamp;
  }

  event UserRegistered(address accountAddress, string userId, ROLE role, uint256 timestamp);

  function registerUser(address accountAddress, string calldata userId, ROLE role) external;

  function getUserDetails(address accountAddress) external view returns (User memory);
}