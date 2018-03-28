var DAO = artifacts.require('../contracts/DAO.sol');
var Role = artifacts.require('../contracts/Role.sol');

contract('DAO', function(accounts) {
  let DAOInstance = null;
  beforeEach('setting up DAO with founder', async () => {
    // worth noting that when this is instantiated, a founder member gets added
    let roleNames = ['roleA', 'roleB', 'roleC', 'roleD'];
    let roleVotes = [1, 5, 10, 15];
    DAOInstance = await DAO.new(
      'TestName',
      'FlatIndividual',
      roleNames,
      roleVotes,
      [],
      [],
      [],
    );
  });

  it('Should populate role mapping correctly', async () => {
    //lol not necessary really
  });
});
