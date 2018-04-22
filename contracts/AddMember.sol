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
  function addMember(address _targetMember, bytes32 _memberName, bytes32 _roleName) public;
}

contract AddMember is owned {
  address targetMember;
  bytes32 memberName;
  bytes32 roleName;

  function AddMember(address _targetMember, bytes32 _memberName, bytes32 _roleName) public {
    targetMember = _targetMember;
    memberName = _memberName;
    roleName = _roleName;
  }

  function run(address DAOAddress) public {
    DAO dao = DAO(DAOAddress);
    dao.addMember(targetMember, memberName, roleName);
  }
}
