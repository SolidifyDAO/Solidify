var Proposal = artifacts.require('../contracts/Proposal.sol')
var choicesList = ['Chocolate', 'Vanilla', 'Strawberry']

contract('Proposal', function(accounts) {
  let ProposalInstance = null
  beforeEach('setting up proposal with options', async() => {
    ProposalInstance = await Proposal.new(choicesList)
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
    await ProposalInstance.giveRightToVote(accounts[1], tx)

    // send from an address that should be able to vote
    tx = {from: accounts[1]}
    await ProposalInstance.vote(0, tx)
    let voterWhoVoted = await ProposalInstance.voters(accounts[1])
    assert.equal(voterWhoVoted[1], true)

    // an address that shouldn't be able to vote
    tx = {from: accounts[2]}
    await ProposalInstance.vote(0, tx)
    let voterWhoCantVote = await ProposalInstance.voters(accounts[2])
    assert.equal(voterWhoVoted[2], false)
  })

  it("Should not allow voting twice", async() => {
    // Before votes happen
    let choiceNoVotes = await ProposalInstance.choices(0)
    assert.equal(choiceNoVotes[1], 0)

    // Creator votes for choice 0.
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}
    await ProposalInstance.vote(0, tx)

    let choiceVoteOnce = await ProposalInstance.choices(0)
    assert.equal(choiceVoteOnce[1], 1)

    // Creator tries to vote for choice 0 again. Should revert.
    try {
      await ProposalInstance.vote(0, tx)
    } catch (error) {
      assert(error.message.search('revert') >= 1, true)
    }
  })

  it("Should vote based on weight", async() => {
    // creator votes for option 1
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}
    await ProposalInstance.vote(0, tx)
    let choiceVoteOnce = await ProposalInstance.choices(0)
    assert.equal(choiceVoteOnce[1], 1)

    // another account is given a weight of 5 and votes for option 2
    await ProposalInstance.giveRightToVote(accounts[1], tx)
    await ProposalInstance.setWeight(accounts[1], 5, tx)
    tx = {from: accounts[1]}
    await ProposalInstance.vote(1, tx)
    let choiceVoteWeigted5 = await ProposalInstance.choices(1)
    assert.equal(choiceVoteWeigted5[1], 5)
  })

  it("Should only be able to vote for valid options", async() => {
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}
    // voting for an index == num of options
    try {
      await ProposalInstance.vote(choicesList.length, tx)
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
    let creator = await ProposalInstance.creator()
    var tx = {from: creator}
    var votes = []
    for (i = 0; i < 5; i++) {
      await ProposalInstance.giveRightToVote(accounts[i + 1], tx)
      var choiceIndex = Math.floor(Math.random() * choicesList.length)
      await ProposalInstance.vote(choiceIndex , {from: accounts[i + 1]})
      votes.push(choiceIndex)
    }
    let winner = await ProposalInstance.findWinner()
    assert.equal(web3.toAscii(winner).replace(/\u0000/g, ''), choicesList[computeMode(votes)])
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
