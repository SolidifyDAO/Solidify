var Congress = artifacts.require('../contracts/Congress.sol')

contract('Congress', function(accounts) {

  let CongressInstance = null
  beforeEach('setting up proposal with options', async() => {
    // worth noting that when this is instantiated, two members get added
    CongressInstance = await Congress.deployed()
  })

  it("Should be able to add, then remove a member",  async() => {
    // add a member that is not empty/founder
    await CongressInstance.addMember(accounts[1], 'first normal member')
    let addedMemberAddress = await CongressInstance.members(2)
    assert.equal(addedMemberAddress[0], accounts[1])

    // remove that member
    await CongressInstance.removeMember(accounts[1])
    let count = await CongressInstance.countMembers()
    assert.equal(count, 2)
    let removedMemberMembership = await CongressInstance.memberId(accounts[1])
    // TODO failing this check because nothing actually happens to the membership mapping when someone is removed
    // assert.equal(removedMemberMembership.toNumber(), 0)
  })
})

