var Proposal = artifacts.require('./Proposal.sol');
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

    await deployer.deploy(
      AddRole,
      roleVotingPower,
      roleName
    )

    choiceName = "Create The '" + roleName + "' Role"
    choiceAddress = (await AddRole.deployed()).address
  } else if (newProposal['type'] == 'HirePerson') {
    // deploy AddMember proposal
    memberAddress = newProposal['address']
    memberName = newProposal['name']
    memberRole = newProposal['role']

    await deployer.deploy(
      AddMember,
      memberAddress,
      memberName,
      memberRole
    )/*.then(function(instance) {
      console.log(instance.address);
    }).catch(function(err) {
      console.log('ERROR!');
      console.log(err);
    });*/

    choiceName = "Hire " + memberName
    choiceAddress = (await AddMember.deployed()).address
  }

  // create proposal
  instance = await Proposal.new(
    [choiceName],
    [choiceAddress],
    votingEndTime,
    daoAddress
  )/*.then(function(instance) {
    console.log(instance.address);
  }).catch(function(err) {
    console.log('ERROR!');
    console.log(err);
  });*/
  console.log(instance.address)

};
