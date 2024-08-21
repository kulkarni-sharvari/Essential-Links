// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IFarmer.sol';
import './interfaces/IProcessingPlant.sol';
import './interfaces/IRetailer.sol';
import './interfaces/IShipment.sol';
import './interfaces/IUser.sol';

contract SupplyChain is IFarmer, IProcessingPlant, IRetailer, IShipment, IUser {
  address admin;

  //   struct HarverstDetails {
  //     string harvestId;
  //     string date;
  //     string quality;
  //     string quantity;
  //     string location;
  //   }
  constructor() {
    admin = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == admin, 'Only Owner');
    _;
  }

  modifier onlyFarmer() {
    require(userDetails[msg.sender].role == ROLE.FARMER, 'Only Farmer');
    _;
  }
  modifier onlyShipment() {
    require(userDetails[msg.sender].role == ROLE.SHIPMENT, 'Only Shipment');
    _;
  }
  modifier onlyRetailer() {
    require(userDetails[msg.sender].role == ROLE.RETAILER, 'Only Retailer');
    _;
  }
  // user mappings
  mapping(address => User) private userDetails;
  mapping(string harvestId => HarverstDetails harvestDetails) private harvestDetails;
  mapping(address farmerAddress => string harvestId) private farmerIdToharvestId;
  // mapping to store

  function registerUser(address accountAddress, string calldata userId, ROLE _role) external {}

  function recordHarvest(string calldata _uid, string calldata _date, string calldata _quality, string calldata _quantity) external {}

  function RegisterProessingPlant(address _plantAddress) external {}

  function recordProcessing(string calldata _harvestId, PROCESSING_STATUS _status) external {}

  function createBatch(string calldata _batchId, string calldata _harvestId, string calldata _quantity) external {}

  function createPackets(string calldata _batchId, string[] calldata _packageIds) external {}

  function CreateConsignment(ConsignmentDetails calldata _shipmentDetails) external {}

  function UpdateShipment(string calldata _shipmentId, EnvDetails calldata _envDetails) external {}
}
