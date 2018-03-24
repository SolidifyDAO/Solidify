pragma solidity ^0.4.16;

import "contracts/Role.sol";

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

contract DAO is owned {
    mapping(address => Member) public members;

    struct Member {
        Role role;
        address member;
        string name;
    }

    // TODO: Need logic to take input distribution type and create appropriate role subclass to give to all of the Members. This is temporary
    /**
     * Constructor function
     */
    function DAO () public {
        // let's add the founder, to save a step later
        addMember(owner, 'founder', 'CEO');
    }

    /**
     * Add member
     *
     * @param targetMember ethereum address to be added
     * @param memberName public name for that member
     */
    function addMember(address targetMember, string memberName, string roleName) onlyOwner public {
      RoleFlatGroup a = new RoleFlatGroup(50, roleName);
      a.addMemberToRole(targetMember);
      // create the new member in our members map
      members[targetMember] = Member({role: a, member: targetMember, name: memberName});
    }

    /**
     * Remove member
     *
     * @param targetMember ethereum address to be removed
     */
    function removeMember(address targetMember) onlyOwner public returns(Member) {
        // TODO handle not a member
        // SOLUTION: require that the member is non null (compare it to an index in our mapping where all the values for the struct are unset)
      Member storage member = members[targetMember];
      require(member.member != address(0));

      member.role.removeMemberFromRole(targetMember);
      delete members[targetMember];
      return member;
    }
}

