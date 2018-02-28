var Congress = artifacts.require('../contracts/Congress.sol')

var acc0 = web3.eth.accounts[0];
var acc1 = web3.eth.accounts[1];

var meta;

// Check members
Congress.deployed().then(function(sc) {
  console.log(sc.members)
}).then(function(result) {
  console.log(result)
}).catch(function(e) {
  console.log(e)
})


// Add new first non-founder member
Congress.deployed().then(function(sc) {
  return sc.addMember(acc1, 'first normal member')
}).then(function(result) {
  console.log(result)
}).catch(function(e) {
  console.log(e)
})

// Check members
Congress.deployed().then(function(sc) {
  console.log(sc.members)
}).then(function(result) {
  console.log(result)
}).catch(function(e) {
  console.log(e)
})

// Kick this member from the organization
Congress.deployed().then(function(sc) {
  return sc.removeMember(acc1)
}).then(function(result) {
  console.log(result)
}).catch(function(e) {
  console.log(e)
})

// Check members
Congress.deployed().then(function(sc) {
  console.log(sc.members)
}).then(function(result) {
  console.log(result)
}).catch(function(e) {
  console.log(e)
})

module.exports = function(callback) {

}

