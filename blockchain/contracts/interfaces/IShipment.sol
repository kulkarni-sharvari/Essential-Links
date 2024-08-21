// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IShipment {
  //TODO:
  enum LOCATION {
    IN_TRANSIT,
    STORAGE
  }
  struct ConsignmentDetails {
    string shipmentId;
    string batchId;
    string carrier;
    string departureDate;
    string eta;
  }
  //TODO
  struct EnvDetails {
    string temp;
    string humidity;
    LOCATION location;
  }

  event ConsignmentCreated(ConsignmentDetails _shipmentDetail, string _timestamp);
  event ConsignmentUpdated(ConsignmentDetails _shipmentDetail, EnvDetails _envDetails, string _timestamp);

  function CreateConsignment(ConsignmentDetails calldata _shipmentDetails) external;

  function UpdateShipment(string calldata _shipmentId, EnvDetails calldata _envDetails) external;
}
