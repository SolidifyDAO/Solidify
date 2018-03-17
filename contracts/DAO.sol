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
        //Role role;
        address member;
        string name;
    }

    /**
     * Constructor function
     */
    function DAO () public {
        // let's add the founder, to save a step later
        addMember(owner, 'founder');
    }

    /**
     * Add member
     *
     * @param targetMember ethereum address to be added
     * @param memberName public name for that member
     */
    function addMember(address targetMember, string memberName) onlyOwner public {
      // create the new member in our members map
      members[targetMember] = Member({member: targetMember, name: memberName});
    }

    /**
     * Remove member
     *
     * @param targetMember ethereum address to be removed
     */
    function removeMember(address targetMember) onlyOwner public {
        //require(memberId[targetMember] != 0);

        //for (uint i = memberId[targetMember]; i<members.length-1; i++){
        //    members[i] = members[i+1];
        //}
        //delete members[members.length-1];
        //members.length--;

    }
}

