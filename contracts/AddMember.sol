pragma solidity ^0.4.16;

contract owned {
    address public owner;

    function owned()  public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner  public {
        owner = newOwner;
    }
}

contract AddMember is owned {
  uint public i;

  function AddMember() public {
    i = 0;
  }

  function run(address DAOAddress) public {
    i++;
  }
}
