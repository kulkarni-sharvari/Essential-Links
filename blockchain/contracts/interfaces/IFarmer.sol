// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFarmer {
  struct HarverstDetails {
    string harvestId;
    string date;
    string quality;
    string quantity;
    string location;
  }
  event LeavesHarvested(HarverstDetails harvestDetails, string _timestamp);

  function recordHarvest(string calldata _uid, string calldata _date, string calldata _quality, string calldata _quantity) external;
}
