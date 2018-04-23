var Proposal = artifacts.require('./Proposal.sol');

function clArgs(index) {
  return process.argv[index + 4]
}

module.exports = async function(callback) {
  // pull in the json file with information on this vote request
  voteInfo = require(clArgs(0));
  console.log(voteInfo)

  voteIndex = voteInfo['index'];
  proposalAddr = voteInfo['proposalAddr'];
  userAddr = voteInfo['userAddr'];

  let proposalInstance = await Proposal.at(proposalAddr)
  var tx = {from: userAddr}
  await ProposalInstance.vote(voteIndex, tx)

  let votedChoice = await ProposalInstance.choices(voteIndex)
  console.log(votedChoice[1].toNumber())
};


