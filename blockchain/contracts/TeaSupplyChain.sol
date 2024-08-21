// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IFarmer
 * @dev Interface for managing the harvest details of a farmer.
 */
interface IFarmer {
  struct HarvestDetails {
    string harvestId;
    string date;
    string quality;
    string quantity;
    string location;
    address farmerId;
  }

  event LeavesHarvested(string _harvestId, string _date, string _quality, string _quantity, string location, address farmerId, uint256 _timestamp);

  function recordHarvest(
    string calldata _harvestId,
    string calldata _date,
    string calldata _quality,
    string calldata _quantity,
    string calldata _location
  ) external;

  function getHarvestDetails(string calldata _harvestId) external view returns (HarvestDetails memory);
}

/**
 * @title IUser
 * @dev Interface for managing users in the supply chain.
 */
interface IUser {
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

  function getUserDetails(address _account) external view returns (User memory);
}

interface IProcessingPlant {
  enum PROCESSING_STATUS {
    WITHERING,
    ROLLING,
    FERMENTING,
    DRYING,
    SORTING,
    PACKED
  }
  struct BatchDetails {
    string batchId;
    string harvestId;
    string packetQuantity;
    string[] packetIds;
  }

  event ProcessingDetailsUpdated(string _harvestId, uint256 _status, uint256 _timestamp);
  event BatchCreated(string _batchId, string _harvestId, string _quantity, string[] _packetIds, uint256 _timestamp);
  event PacketsCreated(string _batchId, string[] _packteIds, uint256 _timestamp);

  function recordProcessing(string calldata _harvestId, uint256 _status) external;

  function getProcessingStatus(string calldata _harvestId) external view returns (PROCESSING_STATUS);

  function createBatch(string calldata _batchId, string calldata _harvestId, string calldata _quantity, string[] calldata _packetIds) external;
}

interface IShipment {
  // Enum to represent the consignment status
  enum ConsignmentStatus {
    Created,
    InTransit,
    Storage,
    Received
  }

  // Struct to represent the consignment details
  struct Consignment {
    string consignmentId;
    string[] batchIds;
    string carrier;
    string departureDate;
    string eta;
  }

  // Struct to represent other environmental details related to the consignment
  struct OtherDetails {
    string temperature;
    string humidity;
    ConsignmentStatus status;
  }

  // Combined struct for detailed consignment information
  struct ConsignmentDetails {
    Consignment consignment;
    OtherDetails otherDetails;
  }

  // Event emitted when a consignment is created
  event ConsignmentCreated(string consignmentId, string[] batchIds, string carrier, string departureDate, string eta, uint256 timestamp);

  // Event emitted when consignment details are updated
  event ConsignmentUpdated(string consignmentId, string temperature, string humidity, ConsignmentStatus status, uint256 timestamp);

  // Function to create a new consignment
  function createConsignment(
    string calldata consignmentId,
    string[] calldata batchIds,
    string calldata carrier,
    string calldata departureDate,
    string calldata eta
  ) external;

  // // Function to update existing consignment details
  function updateConsignment(string calldata consignmentId, string calldata temperature, string calldata humidity, ConsignmentStatus status) external;

  // Function to retrieve consignment details
  function getConsignmentDetails(string calldata consignmentId) external view returns (ConsignmentDetails memory);
}

/**
 * @title SupplyChain
 * @dev Implementation of the supply chain system with user registration and harvest recording.
 */
contract SupplyChain is IUser, IFarmer, IProcessingPlant, IShipment {
  address private admin;

  mapping(address => User) private userDetails;
  mapping(address => string[]) private farmerIdToHarvestIds;
  mapping(string => HarvestDetails) private harvestIdToHarvestDetails;
  mapping(string => PROCESSING_STATUS) private harvestIdToProcessingDetails;
  mapping(string => BatchDetails) private batchIdToBatchDetails;
  mapping(string => ConsignmentDetails) private consignmentIdToConsignmentDetails;

  constructor() {
    admin = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == admin, 'Only Admin can perform this action');
    _;
  }

  modifier onlyRole(ROLE _role) {
    require(userDetails[msg.sender].role == _role, 'Invalid Role');
    _;
  }

  /**
   * @dev Registers a new user.
   * @param _accountAddress Address of the user.
   * @param _userId Unique ID of the user.
   * @param _role Role of the user in the supply chain.
   */
  function registerUser(address _accountAddress, string calldata _userId, ROLE _role) external override onlyOwner {
    require(_accountAddress != address(0), 'Zero Address Not Allowed');
    require(bytes(_userId).length > 0, 'User ID is required');
    require(userDetails[_accountAddress].accountAddress == address(0), 'User already registered');

    userDetails[_accountAddress] = User({userId: _userId, accountAddress: _accountAddress, role: _role});

    emit UserRegistered(_accountAddress, _userId, _role);
  }

  /**
   * @dev Retrieves the details of a user.
   * @param _account Address of the user.
   * @return The user's details.
   */
  function getUserDetails(address _account) external view override returns (User memory) {
    require(_account != address(0), 'Invalid address');
    return userDetails[_account];
  }

  /**
   * @dev Records a new harvest by the farmer.
   * @param _harvestId Unique ID of the harvest.
   * @param _date Date of the harvest.
   * @param _quality Quality of the harvested leaves.
   * @param _quantity Quantity of the harvested leaves.
   * @param _location Location of the harvest.
   */
  function recordHarvest(
    string calldata _harvestId,
    string calldata _date,
    string calldata _quality,
    string calldata _quantity,
    string calldata _location
  ) external override onlyRole(ROLE.FARMER) {
    require(harvestIdToHarvestDetails[_harvestId].farmerId == address(0), 'Harvest ID already exists');
    _storeHarvest(_harvestId, _date, _quality, _quantity, _location);
  }

  /**
   * @dev Internal function to store harvest details.
   * @param _harvestId Unique ID of the harvest.
   * @param _date Date of the harvest.
   * @param _quality Quality of the harvested leaves.
   * @param _quantity Quantity of the harvested leaves.
   * @param _location Location of the harvest.
   */
  function _storeHarvest(
    string memory _harvestId,
    string memory _date,
    string memory _quality,
    string memory _quantity,
    string memory _location
  ) internal {
    HarvestDetails memory newHarvest = HarvestDetails({
      harvestId: _harvestId,
      date: _date,
      quality: _quality,
      quantity: _quantity,
      location: _location,
      farmerId: msg.sender
    });

    farmerIdToHarvestIds[msg.sender].push(_harvestId);
    harvestIdToHarvestDetails[_harvestId] = newHarvest;

    emit LeavesHarvested(_harvestId, _date, _quality, _quantity, _location, msg.sender, block.timestamp);
  }

  /**
   * @dev Retrieves the details of a harvest.
   * @param _harvestId Unique ID of the harvest.
   * @return The harvest's details.
   */
  function getHarvestDetails(string calldata _harvestId) external view override returns (HarvestDetails memory) {
    require(bytes(_harvestId).length > 0, 'Harvest ID is required');
    require(harvestIdToHarvestDetails[_harvestId].farmerId != address(0), 'Harvest ID does not exist');

    return harvestIdToHarvestDetails[_harvestId];
  }

  function recordProcessing(string calldata _harvestId, uint256 _status) external override {
    // TODO: check requires
    harvestIdToProcessingDetails[_harvestId] = PROCESSING_STATUS(_status);
    emit ProcessingDetailsUpdated(_harvestId, _status, block.timestamp);
  }

  function createBatch(
    string calldata _batchId,
    string calldata _harvestId,
    string calldata _quantity,
    string[] calldata _packetIds
  ) external override onlyRole(ROLE.PROCESSING_PLANT) {
    //todo: check validations
    // batchIdToBatchDetails[_batchId].batchId =
    _createBatch(_batchId, _harvestId, _quantity, _packetIds);
  }

  function _createBatch(string memory _batchId, string memory _harvestId, string memory _quantity, string[] memory _packetIds) internal {
    BatchDetails memory newBatch = BatchDetails({batchId: _batchId, harvestId: _harvestId, packetQuantity: _quantity, packetIds: _packetIds});
    batchIdToBatchDetails[_batchId] = newBatch;
    emit BatchCreated(_batchId, _harvestId, _quantity, _packetIds, block.timestamp);
  }

  function getProcessingStatus(string calldata _harvestId) external view override returns (PROCESSING_STATUS) {
    //TODO input validations
    return harvestIdToProcessingDetails[_harvestId];
  }

  function createConsignment(
    string calldata _consignmentId,
    string[] calldata _batchIds,
    string calldata _carrier,
    string calldata _departureDate,
    string calldata _eta
  ) external onlyRole(ROLE.SHIPMENT) {
    //todo: input validations
    _createConsignment(_consignmentId, _batchIds, _carrier, _departureDate, _eta);
  }

  function _createConsignment(
    string calldata _consignmentId,
    string[] calldata _batchIds,
    string calldata _carrier,
    string calldata _departureDate,
    string calldata _eta
  ) internal {
    Consignment memory newConsignment = Consignment({
      consignmentId: _consignmentId,
      batchIds: _batchIds,
      carrier: _carrier,
      departureDate: _departureDate,
      eta: _eta
    });

    ConsignmentDetails memory consignmentDetails = ConsignmentDetails({
      consignment: newConsignment,
      otherDetails: OtherDetails({temperature: '', humidity: '', status: ConsignmentStatus.Created})
    });
    consignmentIdToConsignmentDetails[_consignmentId] = consignmentDetails;
    emit ConsignmentCreated(_consignmentId, _batchIds, _carrier, _departureDate, _eta, block.timestamp);
  }

  function getConsignmentDetails(string calldata _consignmentId) external view returns (ConsignmentDetails memory) {
    //tpdo : Add validations
    return consignmentIdToConsignmentDetails[_consignmentId];
  }

  //TODO: give access to both Shipment and Retailer to update
  function updateConsignment(
    string calldata _consignmentId,
    string calldata _temperature,
    string calldata _humidity,
    ConsignmentStatus _status
  ) external override onlyRole(ROLE.SHIPMENT) {
    //todo: add validation
    OtherDetails storage otherDetails = consignmentIdToConsignmentDetails[_consignmentId].otherDetails;
    otherDetails.humidity = _humidity;
    otherDetails.temperature = _temperature;
    otherDetails.status = _status;

    emit ConsignmentUpdated(_consignmentId, _temperature, _humidity, _status, block.timestamp);
  }
}
