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

    bytes32 public distributionScheme;
    bytes32 public daoName;
    Proposal[] public proposals;

    mapping(address => Member) public members;
    mapping(bytes32 => Role) public roleMap;

    struct Member {
        Role role;
        address member;
        bytes32 name;
    }

    struct Proposal {
      address proposal;
      address[] choices;
      bytes32 name;
      bytes32 desc;
    }

    modifier onlyMembers {
        address member = members[msg.sender].member;
        require(member != address(0));
        _;
    }

    modifier onlyProposalsOrDao {
        bool allow = (msg.sender == owner);
        for(uint i = 0; i < proposals.length; i++) {
          for(uint j = 0; j < proposals[i].choices.length; j++) {
            if (proposals[i].choices[j] == msg.sender) {
              allow = true;
              break;
            }
          }
        }
        require(allow);
        _;
    }

    // TODO: Need logic to take input distribution type and create appropriate role subclass to give to all of the Members. This is temporary
    /**
     * Constructor function
     */
    function DAO (bytes32 _daoName,
                  bytes32 _distributionScheme,
                  bytes32[] _roleNames,
                  uint[] _roleVotes,
                  address[] _memberAddrs,
                  bytes32[] _memberNames,
                  bytes32[] _memberRoles) public {
        require(_roleNames.length == _roleVotes.length);
        require(_memberAddrs.length == _memberRoles.length);
        require(_memberAddrs.length == _memberNames.length);

        // let's add the founder, to save a step later
        daoName = _daoName;
        distributionScheme = _distributionScheme;
        // create all Roles and store them for later
        for (uint i = 0; i < _roleNames.length; i++) {
          addRole(_distributionScheme, _roleVotes[i], _roleNames[i]);
        }

        // create all members
        for (i = 0; i < _memberAddrs.length; i++) {
          addMember(_memberAddrs[i], _memberNames[i], _roleNames[i]);
        }
    }

    function addRole(bytes32 _distributionScheme, uint _roleVotes, bytes32 _roleName) private {
      Role r;
      if (equalsbytes32(_distributionScheme, "FlatIndividual")) {
        r = new RoleFlatIndividual(_roleVotes, _roleName);
      } else if (equalsbytes32(_distributionScheme, "FlatGroup")) {
        r = new RoleFlatGroup(_roleVotes, _roleName);
      } else if (equalsbytes32(_distributionScheme, "PercentageBased")) {
        r = new RolePercentageBased(_roleVotes, _roleName);
      }
      roleMap[_roleName] = r;
    }

    /**
     * Add member
     *
     * @param _targetMember ethereum address to be added
     * @param _memberName public name for that member
     * @param _roleName public name for the role of this member
     */
    function addMember(address _targetMember, bytes32 _memberName, bytes32 _roleName) onlyProposalsOrDao public {
      Role roleOfMember = roleMap[_roleName];
      require(roleOfMember != address(0));

      roleOfMember.addMemberToRole(_targetMember);

      // create the new member in our members map
      members[_targetMember] = Member({role: roleOfMember, member: _targetMember, name: _memberName});
    }

  /**
    * Remove member
    *
    * @param targetMember ethereum address to be removed
    */
    function removeMember(address targetMember) onlyProposalsOrDao public returns(Member) {
      Member storage member = members[targetMember];
      require(member.member != address(0));

      member.role.removeMemberFromRole(targetMember);
      delete members[targetMember];
      return member;
    }

    function equalsbytes32 (bytes32 a, bytes32 b) private pure returns (bool){
       return keccak256(a) == keccak256(b);
    }

    function addProposal(address _proposalAddress, bytes32 _proposalName, bytes32 _description, address[] _choices) onlyMembers public {
      proposals.push(Proposal({proposal: _proposalAddress, name: _proposalName, desc: _description, choices: _choices}));
    }
}

