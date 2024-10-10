// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.27;

import "./EventDecleration.sol";

contract Message {
    address public owner;

    string public message;

    constructor() {
        // string memory _message
        // message = _message;
        owner = msg.sender;
    }

    function setMessage(string memory _message) public {
        require(msg.sender != address(0), "You can't set your own message");
        require(msg.sender == owner, "You aren't the owner");
        message = _message;
        emit messageSet(msg.sender, _message);
    }

    function getMessage() public view returns (string memory message_) {
        return message;
    }

    function transferOwnership(address _newOwner) public {
        require(msg.sender == owner, "You aren't the owner");
        require(
            _newOwner != address(0),
            "You can't transfer ownership to zero address"
        );
        emit OwnerShipTransfer(owner, _newOwner);
        owner = _newOwner;
    }
}
