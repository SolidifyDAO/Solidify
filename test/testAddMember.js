var DAO = artifacts.require('../contracts/DAO.sol')
var Role = artifacts.require('../contracts/Role.sol')

contract('DAO', function(accounts) {

  let DAOInstance = null
  beforeEach('setting up DAO with founder', async() => {
    // worth noting that when this is instantiated, a founder member gets added
    DAOInstance = await DAO.new()
  })

  it("Should be able to add, then remove a member",  async() => {
    // add a member that is not the founder
    await DAOInstance.addMember(accounts[1], 'first normal member', 'employee')
    let addedMember = await DAOInstance.members(accounts[1])
    // assert name
    assert.equal(addedMember[2], 'first normal member')
    // assert role
    let roleInstance = await Role.at(addedMember[0]) // *This is how you get a contract instance at a specific address!
    let roleName = await roleInstance.getRoleName()
    assert.equal(roleName, 'employee')

    // remove that member
    await DAOInstance.removeMember(accounts[1])
    assert.deepEqual({}, DAOInstance.members(accounts[1]))
  })
})

