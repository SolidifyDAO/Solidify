var Proposal = artifacts.require('../contracts/Proposal.sol')
var DAO = artifacts.require('../contracts/DAO.sol')
var Dummy = artifacts.require('../contracts/Dummy.sol')
var AddMember = artifacts.require('../contracts/AddMember.sol')
var AddRole = artifacts.require('../contracts/AddRole.sol')
var Role = artifacts.require('../contracts/Role.sol')
var choicesList = ['Nil Choice', 'Chocolate']

contract('RoleFlatGroup', function(accounts) {
  let ProposalInstance = null
  let DAOInstance = null
  beforeEach('setting up proposal with options', async() => {
    DAOInstance = await DAO.new(
      'TestName',
      'FlatGroup',
      ['nil', 'employee', 'betterEmployee', 'bestEmployee'],
      [0, 10, 100, 1000],
      [],
      [],
      [],
    )
    await DAOInstance.addMember(accounts[0],
                                'account' + 0,
                                'nil')
   tx = {from: accounts[0]}
   DummyInstance1 = await Dummy.new()
   DummyInstance2 = await Dummy.new()
   var dummyList = [DummyInstance1.address, DummyInstance2.address]
   var choicesListwoutNil = ['Chocolate']
   ProposalInstance = await Proposal.new(choicesListwoutNil, dummyList, 0, DAOInstance.address)
   await DAOInstance.addProposal(ProposalInstance.address, 'MyProposal', 'MyProposalDesc', dummyList, tx)
  })
  it("Should have flat group roles vote based on their role weight", async() => {
    await DAOInstance.addMember(accounts[1],
                                'account' + 1,
                                'employee')
    await DAOInstance.addMember(accounts[2],
                                'account' + 2,
                                'betterEmployee')
    await DAOInstance.addMember(accounts[3],
                                'account' + 3,
                                'bestEmployee')

    // we should have one of each role
    var roleAddress = await DAOInstance.roleMap('employee')
    var roleInstance = await Role.at(roleAddress)
    var count = await roleInstance.getMemberCount()
    assert.equal(count.toNumber(), 1)

    // regular employee should vote with a weight of 10
    tx = {from: accounts[1]}
    await ProposalInstance.vote(0, tx)
    var voterWhoVoted = await ProposalInstance.voters(accounts[1])
    assert.equal(voterWhoVoted[0], true)
    var choiceNil = await ProposalInstance.choices(0)
    assert.equal(choiceNil[1].toNumber(), 10)


    // better employee should vote with a weight of 100
    tx = {from: accounts[2]}
    await ProposalInstance.vote(1, tx)
    var voterWhoVoted = await ProposalInstance.voters(accounts[2])
    assert.equal(voterWhoVoted[0], true)
    var choiceNil = await ProposalInstance.choices(1)
    assert.equal(choiceNil[1].toNumber(), 100)

    await DAOInstance.addMember(accounts[4],
                                'account4',
                                'betterEmployee')
    var roleAddress = await DAOInstance.roleMap('betterEmployee')
    var roleInstance = await Role.at(roleAddress)
    var count = await roleInstance.getMemberCount()
    // because of this distribution scheme, better employee should now vote with a weight of 50
    tx = {from: accounts[4]}
    await ProposalInstance.vote(1, tx)
    var voterWhoVoted = await ProposalInstance.voters(accounts[4])
    assert.equal(voterWhoVoted[0], true)
    var choiceNil = await ProposalInstance.choices(1)
    assert.equal(choiceNil[1].toNumber(), 150)


    // best employee should vote with a weight of 1000
    tx = {from: accounts[3]}
    await ProposalInstance.vote(0, tx)
    var voterWhoVoted = await ProposalInstance.voters(accounts[3])
    assert.equal(voterWhoVoted[0], true)
    var choiceNil = await ProposalInstance.choices(0)
    assert.equal(choiceNil[1].toNumber(), 1010) // accumulated from before

    await DAOInstance.addMember(accounts[5],
                                'account5',
                                'bestEmployee')
    // because of this distribution scheme, best employee should now vote with a weight of 500
    tx = {from: accounts[5]}
    await ProposalInstance.vote(1, tx)
    var voterWhoVoted = await ProposalInstance.voters(accounts[5])
    assert.equal(voterWhoVoted[0], true)
    var choiceNil = await ProposalInstance.choices(1)
    assert.equal(choiceNil[1].toNumber(), 650)
  })
})



