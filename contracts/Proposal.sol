pragma solidity ^0.4.16;

/// @title Voting with delegation.
contract Proposal {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        uint weight; // weight is based on group membership
        bool voted;  // if true, that person already voted
        uint vote;   // index of the voted proposal
    }

    // This is a type for a single choice.
    struct Choice {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
        // TODO: Include a callback function/external contract here that executes the proposal
    }

    address public creator;

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Choice` structs.
    Choice[] public choices;

    /// Create a new proposal to choose one of choices.
    function Proposal(bytes32[] choiceNames) public {
        creator = msg.sender;
        voters[creator].weight = 1;

        // For each of the provided choice names,
        // create a new Choice object and add it
        // to the end of the array.
        for (uint i = 0; i < choiceNames.length; i++) {
            // `Choice({...})` creates a temporary
            // Choice object and `choices.push(...)`
            // appends it to the end of `choices`.
            choices.push(Choice({
                name: choiceNames[i],
                voteCount: 0
            }));
        }
    }

    // TODO: Just used for testing for now, might need to be used for delegation schemes?
    function setWeight(address voter, uint weight) public {
        require(
            (msg.sender == creator) &&
            !voters[voter].voted
        );
        voters[voter].weight = weight;
    }

    // Give `voter` the right to vote on this ballot.
    // May only be called by `creator`.
    // TODO: Parameter should be a group of addresses to give rights to vote to
    function giveRightToVote(address voter) public {
        // If the argument of `require` evaluates to `false`,
        // it terminates and reverts all changes to
        // the state and to Ether balances. It is often
        // a good idea to use this if functions are
        // called incorrectly. But watch out, this
        // will currently also consume all provided gas
        // (this is planned to change in the future).
        require(
            (msg.sender == creator) &&
            !voters[voter].voted &&
            (voters[voter].weight == 0)
        );
        // TODO: Group passed in will have a computeWeight() function
        voters[voter].weight = 1;
    }



    /// Give your vote to choice `choices[choice_index].name`.
    function vote(uint choice_index) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted);
        sender.voted = true;
        sender.vote = choice_index;

        // If `choice_index` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        choices[choice_index].voteCount += sender.weight;
    }

    /// @dev Computes the winning choice taking all
    /// previous votes into account.
    // TODO: Figure out how to resolve ties
    function winningChoice() public view
            returns (uint winningChoice_)
    {
        uint winningVoteCount = 0;
        for (uint c = 0; c < choices.length; c++) {
            if (choices[c].voteCount > winningVoteCount) {
                winningVoteCount = choices[c].voteCount;
                winningChoice_ = c;
            }
        }
    }

    // Calls winningChoice() function to get the index
    // of the winner contained in the choices array and then
    // returns the name of the winner
    function findWinner() public view
            returns (bytes32 winnerName_)
    {
        // TODO: Execute the callback/external proposal that won
        winnerName_ = choices[winningChoice()].name;
    }
}
