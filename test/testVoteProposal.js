var Proposal = artifacts.require('../contracts/Proposal.sol')
var DAO = artifacts.require('../contracts/DAO.sol')
var Dummy = artifacts.require('../contracts/Dummy.sol')
var AddMember = artifacts.require('../contracts/AddMember.sol')
var AddRole = artifacts.require('../contracts/AddRole.sol')
var Role = artifacts.require('../contracts/Role.sol')
var choicesList = ['Nil Choice', 'Chocolate', 'Vanilla', 'Strawberry', 'Pistachio']

contract('Proposal', function(accounts) {
  let ProposalInstance = null
  let DAOInstance = null
  beforeEach('setting up proposal with options', async() => {
    DAOInstance = await DAO.new(
      'TestName',
      'FlatIndividual',
      ['employee'],
      [1],
      [],
      [],
      [],
    )
   for (i = 0; i < 5; i++) {
    await DAOInstance.addMember(accounts[i + 1],
                                'account' + (i + 1),
                                'employee')
   }

   tx = {from: accounts[1]}
   DummyInstance1 = await Dummy.new()
   AddMemberInstance1 = await AddMember.new(0x123, 'Joe Wang', 'employee')
   AddMemberInstance2 = await AddMember.new(0x124, 'Hoe Wang', 'employee')
   AddRoleInstance = await AddRole.new(10000, 'CEO')
   var dummyList = [DummyInstance1.address, AddMemberInstance1.address, AddMemberInstance2.address, AddRoleInstance.address]
   var choicesListwoutNil = ['Chocolate', 'Vanilla', 'Strawberry', 'Pistachio']
   ProposalInstance = await Proposal.new(choicesListwoutNil, dummyList, 0, DAOInstance.address)
  await DAOInstance.addProposal(ProposalInstance.address, 'MyProposal', 'MyProposalDesc', dummyList, tx)
  })

  it("Should initialize poll with 0 votes correctly",  async() => {
    for (i = 0; i < choicesList.length; i++) {
      let choice = await ProposalInstance.choices(i)
      assert.equal(choice[1].toNumber(), 0)
    }
  })

  it("Should allow only whitelisted addresses to vote", async() => {
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}

    // send from an address that should be able to vote
    tx = {from: accounts[1]}
    await ProposalInstance.vote(0, tx)
    let voterWhoVoted = await ProposalInstance.voters(accounts[1])
    assert.equal(voterWhoVoted[0], true)

    // an address that shouldn't be able to vote
    //tx = {from: accounts[2]}
    //await ProposalInstance.vote(0, tx)
    //let voterWhoCantVote = await ProposalInstance.voters(accounts[2])
    //assert.equal(voterWhoVoted[0], false)
  })

  it("Should not allow voting twice", async() => {
    // Before votes happen
    let choiceNoVotes = await ProposalInstance.choices(0)
    assert.equal(choiceNoVotes[1], 0)

    // Creator votes for choice 0.
    var tx = {from: accounts[1]}
    await ProposalInstance.vote(0, tx)

    let choiceVoteOnce = await ProposalInstance.choices(0)
    assert.equal(choiceVoteOnce[1].toNumber(), 1)

    // Creator tries to vote for choice 0 again. Should revert.
    try {
      await ProposalInstance.vote(0, tx)
    } catch (error) {
      assert(error.message.search('revert') >= 1, true)
    }
  })

  it("Should only be able to vote for valid options", async() => {
    let creator = await ProposalInstance.creator()
    var tx = {from: accounts[1]}
    // voting for an index == num of options
    try {
      await ProposalInstance.vote(choicesList.length + 1, tx)
    } catch (error) {
      assert(error.message.search('invalid opcode') >= 1, true)
    }

    // voting for a negative index
    try {
      await ProposalInstance.vote(-1, tx)
    } catch (error) {
      assert(error.message.search('invalid opcode') >= 1, true)
    }
  })

  it("Should calculate the results correctly", async() => {
    // sets up 5 accounts to vote on a random choice.
    var tx = {from: accounts[1]}
    var votes = []
    for (i = 0; i < 5; i++) {
      var choiceIndex = Math.floor(Math.random() * choicesList.length)
      await ProposalInstance.vote(choiceIndex , {from: accounts[i + 1]})
      votes.push(choiceIndex)
    }
    let winner = await ProposalInstance.findWinner.call()
    computedWinner = choicesList[computeMode(votes)]
    assert.equal(toString(winner), computedWinner)
  })
  it("Should check that dummy increments1", async() => {
    // sets up 5 accounts to vote on a random choice.
    assert(await DummyInstance1.i(), 0)
    await DummyInstance1.run(await DAOInstance.address)
    assert(await DummyInstance1.i(), 1)
  })
  it("Should check that dummy increments2", async() => {
    // sets up 5 accounts to vote on a random choice.
    let creator = await ProposalInstance.creator()
    var tx = {from: accounts[1]}
    var votes = []
    let choiceIndex = 1
    await ProposalInstance.vote(choiceIndex, tx)
    votes.push(choiceIndex)
    let winner = await ProposalInstance.findWinner.call()
    await ProposalInstance.executeWinner()
    let winnerRunnableAddress = await ProposalInstance.findWinnerRunnable.call()
    let winnerRunnable = await Dummy.at(winnerRunnableAddress)
    assert.equal(toString(winner), choicesList[computeMode(votes)])
    assert.equal((await winnerRunnable.i()).toNumber(), 1)
  })

  it("Should check that a member is added from a manual contract execute", async() => {
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}

    await AddMemberInstance1.run(await DAOInstance.address)

    let memberJoe = await DAOInstance.members('0x123')
    assert.equal(toString(memberJoe[2]), 'Joe Wang')
		let roleInstance = await Role.at(memberJoe[0]) // *This is how you get a contract instance at a specific address!
    let roleName = await roleInstance.getRoleName()
    assert.equal(toString(roleName), 'employee')
  })
  it("Should check that a member is added on proposal resolution", async() => {
    // sets up 5 accounts to vote on a random choice.
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}
    var votes = []
    ADD_MEMBER_INDEX = 2
    await ProposalInstance.vote(ADD_MEMBER_INDEX , {from: accounts[1]})
    votes.push(ADD_MEMBER_INDEX)
    let winner = await ProposalInstance.findWinner.call()
    await ProposalInstance.executeWinner()
    let winnerRunnableAddress = await ProposalInstance.findWinnerRunnable.call()
    let winnerRunnable = await AddMember.at(winnerRunnableAddress)
    assert.equal(toString(winner), choicesList[computeMode(votes)])

    // same as in above test
    let memberJoe = await DAOInstance.members('0x123')
    assert.equal(toString(memberJoe[2]), 'Joe Wang')
		let roleInstance = await Role.at(memberJoe[0]) // *This is how you get a contract instance at a specific address!
    let roleName = await roleInstance.getRoleName()
    assert.equal(toString(roleName), 'employee')
  })

  it("Should check that a role is added on proposal resolution", async() => {
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}

    await AddRoleInstance.run(await DAOInstance.address)

    let roleCEO = await DAOInstance.roleMap('CEO')
		let roleInstance = await Role.at(roleCEO) // *This is how you get a contract instance at a specific address!
    let roleName = await roleInstance.getRoleName()
    assert.equal(toString(roleName), 'CEO')
    let roleVotes = await roleInstance.getVotes()
    assert.equal(roleVotes.toNumber(), 10000)
  })
  it("Should check that a member is added on proposal resolution", async() => {
    // sets up 5 accounts to vote on a random choice.
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}
    var votes = []
    ADD_MEMBER_INDEX = 2
    await ProposalInstance.vote(ADD_MEMBER_INDEX , {from: accounts[1]})
    votes.push(ADD_MEMBER_INDEX)
    let winner = await ProposalInstance.findWinner.call()
    await ProposalInstance.executeWinner()
    let winnerRunnableAddress = await ProposalInstance.findWinnerRunnable.call()
    let winnerRunnable = await AddMember.at(winnerRunnableAddress)
    assert.equal(toString(winner), choicesList[computeMode(votes)])

    // same as in above test
    let memberJoe = await DAOInstance.members('0x123')
    assert.equal(toString(memberJoe[2]), 'Joe Wang')
		let roleInstance = await Role.at(memberJoe[0]) // *This is how you get a contract instance at a specific address!
    let roleName = await roleInstance.getRoleName()
    assert.equal(toString(roleName), 'employee')
  })
})

function computeMode(arr) {
    var numMapping = {}
    var greatestFreq = 0
    var mode
    arr.forEach(function findMode(number) {
        numMapping[number] = (numMapping[number] || 0) + 1

        if (greatestFreq < numMapping[number]) {
            greatestFreq = numMapping[number]
            mode = number
        }
    })
    return +mode
}

function toString(str) {
  return web3.toAscii(str).replace(/\u0000/g, '');
}
/**
 * Helper to wait for log emission.
 * @param  {Object} _event The event to wait for.
 */
function promisifyLogWatch(_event) {
  return new Promise((resolve, reject) => {
    _event.watch((error, log) => {
      _event.stopWatching();
      if (error !== null)
        reject(error);

      resolve(log);
    });
  });
}

