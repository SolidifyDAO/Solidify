pragma solidity ^0.4.16;

contract Role {
    address[] roleMembers; // members in the role; 
    string roleName;

    function Role(string _roleName) public {
      roleName = _roleName;
    }

    // TODO: maybe incorporate separate class to represent distribution scheme
    function getVotes() public view returns (uint voteCount);

    function addMemberToRole(address _targetMember) public {
      roleMembers[roleMembers.length] = _targetMember;
      roleMembers.length++;
    }

    function removeMemberFromRole(address _targetMember) public {
      // TODO

    }

    function getRoleName() public returns (string) {
      return roleName;
    }

    function getMembers() public
      returns (address[]) {
        return roleMembers;
    }
}

contract RoleFlatIndividual is Role {

  uint individualTokens;

  function RoleFlatIndividual(string _roleName, uint _individualTokens) public {
    super.Role(_roleName);
    individualTokens = _individualTokens;
  }

  function getVotes() public view returns (uint voteCount) {
    return individualTokens;
  }
}

contract RoleFlatGroup is Role {

  uint groupTokens;

  function RoleFlatGroup(string _roleName, uint _groupTokens) public {
    super.Role(_roleName);
    groupTokens = _groupTokens;
  }

  function getVotes() public view returns (uint voteCount) {
    return uint(groupTokens / roleMembers.length);
  }
}

contract RolePercentageBased is Role() {

  uint percentageOwned; // *Important* This is an integer and must be divided. Not sure how to represent floats atm

  function RolePercentageBased(string _roleName, uint _percentageOwned) public {
    super.Role(_roleName);
    percentageOwned = _percentageOwned;
  }

  function getVotes() public view returns (uint _voteCount) {
    // TODO '500' should be replaced with the total votes in a DAO currently (found ideally via a getter)
    return uint((percentageOwned / 100) * 500);
  }
}


