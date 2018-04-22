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

contract DAO {
    function addRole(uint _roleVotes, bytes32 _roleName) public;
}

contract AddRole is owned {
  uint roleVotes;
  bytes32 roleName;

  function AddRole(uint _roleVotes, bytes32 _roleName) public {
    roleVotes = _roleVotes;
    roleName = _roleName;
  }

  function run(address DAOAddress) public {
    DAO dao = DAO(DAOAddress);
    dao.addRole(roleVotes, roleName);
  }
}
