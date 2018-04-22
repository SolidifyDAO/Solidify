pragma solidity ^0.4.16;

import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

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

contract GenerateMeme is owned, usingOraclize {
  uint public i;
  event memeGenerated(bytes32 _url);

  function GenerateMeme() public {
    i = 0;
  }

  function run(address DAOAddress) public {
    DAO dao = DAO(DAOAddress);
		//LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
    bytes32 url = oraclize_query("URL", "json(https://meme-api.explosivenight.us/v1/random?type=json).url");
    memeGenerated(url);
  }
}
