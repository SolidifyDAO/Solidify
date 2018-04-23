var Proposal = artifacts.require('./Proposal.sol');
var DAO = artifacts.require('./DAO.sol');
var AddMember = artifacts.require('./AddMember.sol');
var AddRole = artifacts.require('./AddRole.sol');

function clArgs(index) {
  return process.argv[index + 4]
}

module.exports = async function(deployer) {
  // pull in the json file specific to the dao we want to create
  newProposal = require(clArgs(0));
  let choiceName = null;
  let choiceAddress = null;
  let daoAddress = newProposal['dao_address'];
  let votingEndTime = newProposal['voting_length'];


  // Hack to check proposal type until joe passes down an explicit 'type' param.
  newProposal['type'] = newProposal.hasOwnProperty('votes') ? 'AddRole' : 'HirePerson';

  if (newProposal['type'] == 'AddRole') {
    // deploy AddRole proposal
    roleName = newProposal['name']
    roleVotingPower = newProposal['votes']

    // TODO: UNUSED
    roleDescription = newProposal['description']

    let addRoleInstance = await AddRole.new(
      roleVotingPower,
      roleName
    )

    choiceName = "Create The '" + roleName + "' Role"
    choiceAddress = addRoleInstance.address
  } else if (newProposal['type'] == 'HirePerson') {
    // deploy AddMember proposal
    memberAddress = newProposal['address']
    memberName = newProposal['name']
    memberRole = newProposal['role']

    let addMemberInstance = await AddMember.new(
      memberAddress,
      memberName,
      memberRole
    )

    choiceName = "Hire " + memberName
    choiceAddress = addMemberInstance.address
  }

  // create proposal
  let daoInstance = await DAO.at(daoAddress)

  Proposal.new(
    [choiceName],
    [choiceAddress],
    votingEndTime,
    daoAddress
  ).then(function(instance) {
    console.log(instance.address);
    // add the proposal we created to the DAO
    daoInstance.addProposal(instance.address, newProposal['name'], newProposal['description'], [choiceAddress])
  }).catch(function(err) {
    console.log('ERROR!');
    console.log(err);
  });


};
