var Proposal = artifacts.require('./Proposal.sol');

function clArgs(index) {
  return process.argv[index + 4]
}

module.exports = async function(callback) {
  // pull in the json file with information on this vote request
  proposalAddress = clArgs(0);
  console.log(proposalAddress)

  let proposalInstance = await Proposal.at(proposalAddress)
  let winningChoiceIndex = await proposalInstance.winningChoice()

  await proposalInstance.executeWinner()
  console.log(winningChoiceIndex.toNumber())
};


