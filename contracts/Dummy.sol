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

contract Dummy is owned {
  uint i = 0;

  function getI() external view returns (uint i) {
    return i;
  }
  
  function run() onlyOwner public {
    i++;
  }
}
