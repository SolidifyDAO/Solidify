var DAO = artifacts.require('./DAO.sol');

function clArgs(index) {
  return process.argv[index + 3]
}

module.exports = function(callback) {
  // pull in the json file specific to the dao we want to create
  newDao = require(clArgs(0));
  console.log(newDao)

  daoName = newDao['name'];
  distScheme = newDao['voting'];
  roleNames = newDao['roles'].map(function(role) { return role['name'] });
  roleVotes = newDao['roles'].map(function(role) { return role['votes'] });
  memberAddrs = newDao['members'].map(function(member) { return member['address'] });
  memberNames = newDao['members'].map(function(member) { return member['name'] });
  memberRoles = newDao['members'].map(function(member) { return member['role'] });

  DAO.new(
    daoName,
    distScheme,
    roleNames,
    roleVotes,
    memberAddrs,
    memberNames,
    memberRoles
  ).then(function(instance) {
    console.log(instance.address);
  }).catch(function(err) {
    console.log('ERROR!');
    console.log(err);
  });
};
