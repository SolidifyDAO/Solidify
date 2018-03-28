pragma solidity ^0.4.2;

contract Role {
    address[] public roleMembers; // members in the role;
    bytes32 public roleName;

    function Role(bytes32 _roleName) public {
      roleName = _roleName;
    }

    function getVotes() public view returns (uint _voteCount);

    function getDistributionScheme() public view returns (bytes32 _distributionScheme);

    function addMemberToRole(address _targetMember) public {
      roleMembers.push(_targetMember);
      roleMembers.length++;
    }

    function removeMemberFromRole(address targetMember) public {
      for (uint i = 0; i < roleMembers.length - 1; i++) {
        if (roleMembers[i] == targetMember) {
            roleMembers[i] = roleMembers[i + 1];
         }
         roleMembers.length--;
      }
    }

    function getRoleName() public view returns (bytes32) {
      return roleName;
    }

    function getMembers() public view returns (address[]) {
        return roleMembers;
    }

    function getMemberCount() public view returns (uint) {
        return roleMembers.length;
    }
}

contract RoleFlatIndividual is Role {

  uint individualTokens;

  function RoleFlatIndividual(uint _individualTokens, bytes32 _roleName) Role(_roleName) public {
    individualTokens = _individualTokens;
  }

  function getVotes() public view returns (uint voteCount) {
    return individualTokens;
  }

  function getDistributionScheme() public view returns (bytes32 distributionScheme) {
    return "FlatIndividual";
  }
}

contract RoleFlatGroup is Role {

  uint groupTokens;

  function RoleFlatGroup(uint _groupTokens, bytes32 _roleName) Role( _roleName) public {
    groupTokens = _groupTokens;
  }

  function getVotes() public view returns (uint voteCount) {
    return uint(groupTokens / roleMembers.length);
  }

  function getDistributionScheme() public view returns (bytes32 distributionScheme) {
    return "FlatGroup";
  }
}

contract RolePercentageBased is Role {

  uint percentageOwned; // *Important* This is an integer and must be divided. Not sure how to represent floats atm

  function RolePercentageBased(uint _percentageOwned, bytes32 _roleName) Role(_roleName) public {
    percentageOwned = _percentageOwned;
  }

  function getVotes() public view returns (uint _voteCount) {
    // TODO '500' should be replaced with the total votes in a DAO currently (found ideally via a getter)
    return uint((percentageOwned / 100) * 500);
  }

  function getDistributionScheme() public view returns (bytes32 distributionScheme) {
    return "PercentageBased";
  }
}

