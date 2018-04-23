pragma solidity ^0.4.16;

import "contracts/DAO.sol";
import "contracts/Role.sol";

contract Runnable {
  function run(address DAOaddr) public;
}

contract Proposal {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        bool voted;  // if true, that person already voted
        uint vote;   // index of the voted proposal
    }

    struct Member {
        Role role;
        address member;
        bytes32 name;
    }

    // This is a type for a single choice.
    struct Choice {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
        address runnable; // address of contract for this choice
        // TODO: Include a callback function/external contract here that executes the proposal
    }

    address public creator;
    address public DAOaddress;
    uint votingEndTime;

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Choice` structs.
    Choice[] public choices;

    /// Create a new proposal to choose one of choices.
    function Proposal(bytes32[] choiceNames, address[] choiceContracts, uint _votingEndTime, address _DAOaddress) public {
        creator = msg.sender;
        votingEndTime = _votingEndTime;
        DAOaddress = _DAOaddress;
        /// Every contract should have a nil choice
        choices.push(Choice({
            name: "Nil Choice",
            voteCount: 0,
            runnable: address(0)
        }));

        // For each of the provided choice names,
        // create a new Choice object and add it
        // to the end of the array.
        for (uint i = 0; i < choiceNames.length; i++) {
             //`Choice({...})` creates a temporary
             //Choice object and `choices.push(...)`
             //appends it to the end of `choices`.
            choices.push(Choice({
                name: choiceNames[i],
                voteCount: 0,
                runnable: choiceContracts[i]
            }));
        }
    }

    function checkVotingPower(address voter) public view returns (uint _votingPower) {
        Role memberRole;
        DAO dao = DAO(DAOaddress);
        (memberRole, ,)= dao.members(voter);
        _votingPower = memberRole.getVotes();
    }



    /// Give your vote to choice `choices[choice_index].name`.
    function vote(uint choice_index) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted);

        DAO dao = DAO(DAOaddress);
        address voterAddr;
        (, voterAddr,) = dao.members(msg.sender);
        require(voterAddr != address(0));
        sender.voted = true;
        sender.vote = choice_index;

        choices[choice_index].voteCount += checkVotingPower(msg.sender);
    }

    /// @dev Computes the winning choice taking all
    /// previous votes into account.
    // TODO: Figure out how to resolve ties
    function winningChoice() public view returns (uint winningChoice_)
    {
        uint winningVoteCount = 0;
        for (uint c = 0; c < choices.length; c++) {
            if (choices[c].voteCount > winningVoteCount) {
                winningVoteCount = choices[c].voteCount;
                winningChoice_ = c;
            }
        }
    }

    function findWinner() public view returns (bytes32 winnerName_)
    {
        winnerName_ = choices[winningChoice()].name;
    }

    function findWinnerRunnable() public view returns (address winnerRunnable_)
    {
        winnerRunnable_ = choices[winningChoice()].runnable;
    }

    function executeWinner() public {
        require(now > votingEndTime);
        Runnable winnerRunnable = Runnable(choices[winningChoice()].runnable);
        if (address(winnerRunnable) != address(0)) {
          // probably, send ETH to this contract
          winnerRunnable.run(DAOaddress);
        }
    }
}
