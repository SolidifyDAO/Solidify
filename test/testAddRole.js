var DAO = artifacts.require('../contracts/DAO.sol');
var Role = artifacts.require('../contracts/Role.sol');

let roleNames = ['roleA', 'roleB', 'roleC', 'roleD'];
let roleVotes = [1, 5, 10, 15];

contract('DAO', function(accounts) {
  it('Role mapping should have the required roles', async () => {
    let DAOInstance = null;
    DAOInstance = await DAO.new(
      'TestName',
      'FlatIndividual',
      roleNames,
      roleVotes,
      [],
      [],
      [],
    );

    for (var i = 0; i < roleNames.length; i++) {
      // make sure each mapped entry at the name actually produces a role with that name
      let roleInMapAddress = await DAOInstance.roleMap(roleNames[i]);
      let roleInMapInstance = await Role.at(roleInMapAddress);
      let roleInMapName = await roleInMapInstance.getRoleName();
      assert.equal(roleNames[i], toString(roleInMapName));
    }
  });

  it('FlatIndividual distribution scheme should create RoleFlatIndividual roles', async () => {
    let DAOInstance = null;
    DAOInstance = await DAO.new(
      'TestName',
      'FlatIndividual',
      roleNames,
      roleVotes,
      [],
      [],
      [],
    );
    for (var i = 0; i < roleNames.length; i++) {
      // make sure each mapped entry at the name actually produces a role with that name
      let roleInMapAddress = await DAOInstance.roleMap(roleNames[i]);
      let roleInMapInstance = await Role.at(roleInMapAddress);
      let distributionScheme = await roleInMapInstance.getDistributionScheme();
      assert.equal('FlatIndividual', toString(distributionScheme));
    }
  });

  it('FlatGroup distribution scheme should create RoleFlatGroup roles', async () => {
    let DAOInstance = null;
    DAOInstance = await DAO.new(
      'TestName',
      'FlatGroup',
      roleNames,
      roleVotes,
      [],
      [],
      [],
    );
    for (var i = 0; i < roleNames.length; i++) {
      // make sure each mapped entry at the name actually produces a role with that name
      let roleInMapAddress = await DAOInstance.roleMap(roleNames[i]);
      let roleInMapInstance = await Role.at(roleInMapAddress);
      let distributionScheme = await roleInMapInstance.getDistributionScheme();
      assert.equal('FlatGroup', toString(distributionScheme));
    }
  });

  it('PercentageBased distribution scheme should create RolePercentageBased roles', async () => {
    let DAOInstance = null;
    DAOInstance = await DAO.new(
      'TestName',
      'PercentageBased',
      roleNames,
      roleVotes,
      [],
      [],
      [],
    );
    for (var i = 0; i < roleNames.length; i++) {
      // make sure each mapped entry at the name actually produces a role with that name
      let roleInMapAddress = await DAOInstance.roleMap(roleNames[i]);
      let roleInMapInstance = await Role.at(roleInMapAddress);
      let distributionScheme = await roleInMapInstance.getDistributionScheme();
      assert.equal('PercentageBased', toString(distributionScheme));
    }
  });

  function toString(str) {
    return web3.toAscii(str).replace(/\u0000/g, '');
  }
});
