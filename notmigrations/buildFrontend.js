var DAO = artifacts.require('./DAO.sol');
var Role = artifacts.require('./Role.sol');
var Proposal = artifacts.require('./Proposal.sol');

function clArgs(index) {
  return process.argv[index + 4]
}

function toString(str) {
  return web3.toAscii(str).replace(/\u0000/g, '');
}

module.exports = async function(callback) {
  // pull in the json file with information on this vote request
  daoAddress = clArgs(0)
  currentMembers = []
  currentRoles = []
  currentProposals = []
  currentCode = []
  daoName = ""

  let daoInstance = await DAO.at(daoAddress)
  let numMembers = await daoInstance.getMemberCount()
  for (i = 0; i < numMembers; i++) {
    let memberAddr = await daoInstance.memberAddrs(i)
    let memberStruct = await daoInstance.members(memberAddr)
    let memberRoleInstance = Role.at(memberStruct[0])
    let roleName = await memberRoleInstance.getRoleName()
    memberDict = {'name': toString(memberStruct[2]), 'address': memberStruct[1], 'role': toString(roleName)}
    currentMembers.push(memberDict)
  }

  let numRoles = await daoInstance.getRoleCount()
  for (i = 0; i < numRoles; i++) {
    let roleName = await daoInstance.roleNames(i)
    let roleAddress = await daoInstance.roleMap(roleName)
    let roleInstance = Role.at(roleAddress)
    let roleVotes = await roleInstance.getVotes()
    roleDict = {'name': toString(roleName), 'voting_power': roleVotes.toNumber()}
    currentRoles.push(roleDict)
  }

  let name = await daoInstance.daoName()
  daoName = toString(name)

  let numProposals = await daoInstance.getProposalCount()
  for (j = 0; j < numProposals.toNumber(); j++) {
    let proposalStruct = await daoInstance.proposals(j)
    let proposalAddress = proposalStruct[0]
    let proposalName = proposalStruct[1]
    let proposalDescription = proposalStruct[2]
    let proposalInstance = await Proposal.at(proposalAddress)
    let voteEnd = await proposalInstance.votingEndTime()
    proposalDict = {'name': toString(proposalName), 'description': toString(proposalDescription), 'end_time': voteEnd.toNumber(), 'address': proposalAddress, 'choices': []}
    currentProposals.push(proposalDict)
  }

  var dao = {
    'name' : daoName,
    'dao_address' : daoAddress,
    'proposals' : currentProposals,
    'roles' : currentRoles,
    'members' : currentMembers
  }
  console.log(JSON.stringify(dao))
};


