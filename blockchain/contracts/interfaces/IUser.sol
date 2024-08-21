// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUser {
  //TODO:

  enum ROLE {
    ADMIN,
    FARMER,
    PROCESSING_PLANT,
    SHIPMENT,
    RETAILER
  }
  struct User {
    string userId;
    address accountAddress;
    ROLE role;
  }

  event UserRegistered(address accountAddress, string userId, ROLE _role);

  function registerUser(address accountAddress, string calldata userId, ROLE _role) external;
}
