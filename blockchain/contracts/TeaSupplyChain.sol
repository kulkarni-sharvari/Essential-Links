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

  event LeavesHarvested(string harvestId, string date, string quality, string quantity, string location, address farmerId, uint256 timestamp);

  function recordHarvest(
    string calldata harvestId,
    string calldata date,
    string calldata quality,
    string calldata quantity,
    string calldata location
  ) external;

  function getHarvestDetails(string calldata harvestId) external view returns (HarvestDetails memory);
}

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
  }

  event UserRegistered(address accountAddress, string userId, ROLE role);

  function registerUser(address accountAddress, string calldata userId, ROLE role) external;

  function getUserDetails(address accountAddress) external view returns (User memory);
}

/**
 * @title IProcessingPlant
 * @dev Interface for managing processing plants in the supply chain.
 */
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

  event ProcessingDetailsUpdated(string harvestId, PROCESSING_STATUS status, uint256 timestamp);
  event BatchCreated(string batchId, string harvestId, string quantity, string[] packetIds, uint256 timestamp);
  event PacketsCreated(string batchId, string[] packetIds, uint256 timestamp);

  function recordProcessing(string calldata harvestId, PROCESSING_STATUS status) external;

  function getProcessingStatus(string calldata harvestId) external view returns (PROCESSING_STATUS);

  function createBatch(string calldata batchId, string calldata harvestId, string calldata quantity, string[] calldata packetIds) external;
}

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
  }

  struct OtherDetails {
    string temperature;
    string humidity;
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
  mapping(string => string) private batchIdsToConsignmentDetails;

  constructor() {
    admin = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == admin, 'Only Admin can perform this action');
    _;
  }

  modifier onlyRole(ROLE role) {
    require(userDetails[msg.sender].role == role, 'You do not have the required role');
    _;
  }

  /**
   * @dev Registers a new user.
   * @param accountAddress Address of the user.
   * @param userId Unique ID of the user.
   * @param role Role of the user in the supply chain.
   */
  function registerUser(address accountAddress, string calldata userId, ROLE role) external override onlyOwner {
    // require(accountAddress != address(0), 'Zero Address Not Allowed');
    // require(bytes(userId).length > 0, 'User ID is required');
    // require(userDetails[accountAddress].accountAddress == address(0), 'User already registered');

    userDetails[accountAddress] = User({userId: userId, accountAddress: accountAddress, role: role});

    emit UserRegistered(accountAddress, userId, role);
  }

  /**
   * @dev Retrieves the details of a user.
   * @param accountAddress Address of the user.
   * @return The user's details.
   */
  function getUserDetails(address accountAddress) external view override returns (User memory) {
    // require(accountAddress != address(0), 'Invalid address');
    return userDetails[accountAddress];
  }

  /**
   * @dev Records a new harvest by the farmer.
   * @param harvestId Unique ID of the harvest.
   * @param date Date of the harvest.
   * @param quality Quality of the harvested leaves.
   * @param quantity Quantity of the harvested leaves.
   * @param location Location of the harvest.
   */
  function recordHarvest(
    string calldata harvestId,
    string calldata date,
    string calldata quality,
    string calldata quantity,
    string calldata location
  ) external override /*onlyRole(ROLE.FARMER)*/ {
    _storeHarvest(harvestId, date, quality, quantity, location);
  }

  /**
   * @dev Internal function to store harvest details.
   * @param harvestId Unique ID of the harvest.
   * @param date Date of the harvest.
   * @param quality Quality of the harvested leaves.
   * @param quantity Quantity of the harvested leaves.
   * @param location Location of the harvest.
   */
  function _storeHarvest(
    string memory harvestId,
    string memory date,
    string memory quality,
    string memory quantity,
    string memory location
  ) internal {
    HarvestDetails memory newHarvest = HarvestDetails({
      harvestId: harvestId,
      date: date,
      quality: quality,
      quantity: quantity,
      location: location,
      farmerId: msg.sender
    });

    farmerIdToHarvestIds[msg.sender].push(harvestId);
    harvestIdToHarvestDetails[harvestId] = newHarvest;

    emit LeavesHarvested(harvestId, date, quality, quantity, location, msg.sender, block.timestamp);
  }

  /**
   * @dev Retrieves the details of a harvest.
   * @param harvestId Unique ID of the harvest.
   * @return The harvest's details.
   */
  function getHarvestDetails(string calldata harvestId) external view override returns (HarvestDetails memory) {
    // require(bytes(harvestId).length > 0, 'Harvest ID is required');
    // require(harvestIdToHarvestDetails[harvestId].farmerId != address(0), 'Harvest ID does not exist');

    return harvestIdToHarvestDetails[harvestId];
  }

  /**
   * @dev Records the processing details for a harvest.
   * @param harvestId Unique ID of the harvest.
   * @param status Processing status of the harvest.
   */
  function recordProcessing(string calldata harvestId, PROCESSING_STATUS status) external override /*onlyRole(ROLE.PROCESSING_PLANT) */ {
    // require(harvestIdToHarvestDetails[harvestId].farmerId != address(0), 'Harvest ID does not exist');
    harvestIdToProcessingDetails[harvestId] = status;
    emit ProcessingDetailsUpdated(harvestId, status, block.timestamp);
  }

  /**
   * @dev Retrieves the processing status of a harvest.
   * @param harvestId Unique ID of the harvest.
   * @return The processing status of the harvest.
   */
  function getProcessingStatus(string calldata harvestId) external view override returns (PROCESSING_STATUS) {
    return harvestIdToProcessingDetails[harvestId];
  }

  /**
   * @dev Creates a new batch from a harvest.
   * @param batchId Unique ID of the batch.
   * @param harvestId Unique ID of the harvest.
   * @param quantity Quantity of the batch.
   * @param packetIds Array of packet IDs in the batch.
   */
  function createBatch(
    string calldata batchId,
    string calldata harvestId,
    string calldata quantity,
    string[] calldata packetIds
  ) external override /*onlyRole(ROLE.PROCESSING_PLANT)*/ {
    BatchDetails memory newBatch = BatchDetails({batchId: batchId, harvestId: harvestId, packetQuantity: quantity, packetIds: packetIds});

    batchIdToBatchDetails[batchId] = newBatch;

    emit BatchCreated(batchId, harvestId, quantity, packetIds, block.timestamp);
    emit PacketsCreated(batchId, packetIds, block.timestamp);
  }

  /**
   * @dev Creates a new consignment.
   * @param consignmentId Unique ID of the consignment.
   * @param batchIds Array of batch IDs in the consignment.
   * @param carrier Carrier responsible for the consignment.
   * @param departureDate Departure date of the consignment.
   * @param eta Estimated time of arrival of the consignment.
   */
  function createConsignment(
    string calldata consignmentId,
    string[] calldata batchIds,
    string calldata carrier,
    string calldata departureDate,
    string calldata eta
  ) external override /*onlyRole(ROLE.SHIPMENT)**/ {
    // // require(consignmentIdToConsignmentDetails[consignmentId].consignment.consignmentId.length == 0, 'Consignment ID already exists');

    Consignment memory newConsignment = Consignment({
      consignmentId: consignmentId,
      batchIds: batchIds,
      carrier: carrier,
      departureDate: departureDate,
      eta: eta
    });

    OtherDetails memory otherDetails = OtherDetails({temperature: '', humidity: '', status: ConsignmentStatus.TRANSIT});

    consignmentIdToConsignmentDetails[consignmentId] = ConsignmentDetails({consignment: newConsignment, otherDetails: otherDetails});

    emit ConsignmentCreated(consignmentId, batchIds, carrier, departureDate, eta, block.timestamp);
  }

  /**
   * @dev Updates an existing consignment.
   * @param consignmentId Unique ID of the consignment.
   * @param temperature Temperature condition during shipment.
   * @param humidity Humidity condition during shipment.
   * @param status Current status of the consignment.
   */
  function updateConsignment(
    string calldata consignmentId,
    string calldata temperature,
    string calldata humidity,
    ConsignmentStatus status
  ) external override /*onlyRole(ROLE.SHIPMENT)**/ {
    // require(consignmentIdToConsignmentDetails[consignmentId].consignment.consignmentId.length > 0, 'Consignment ID does not exist');

    consignmentIdToConsignmentDetails[consignmentId].otherDetails.temperature = temperature;
    consignmentIdToConsignmentDetails[consignmentId].otherDetails.humidity = humidity;
    consignmentIdToConsignmentDetails[consignmentId].otherDetails.status = status;

    emit ConsignmentUpdated(consignmentId, temperature, humidity, status, block.timestamp);
  }

  /**
   * @dev Retrieves the details of a consignment.
   * @param consignmentId Unique ID of the consignment.
   * @return The consignment's details.
   */
  function getConsignmentDetails(string calldata consignmentId) external view override returns (ConsignmentDetails memory) {
    // require(bytes(consignmentId).length > 0, 'Consignment ID is required');
    return consignmentIdToConsignmentDetails[consignmentId];
  }
}
