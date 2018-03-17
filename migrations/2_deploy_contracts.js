var ConvertLib = artifacts.require("./ConvertLib.sol");
var DAO = artifacts.require("./DAO.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, DAO);
  deployer.deploy(DAO);
};
