var ConvertLib = artifacts.require("./ConvertLib.sol");
var Congress = artifacts.require("./Congress.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Congress);
  deployer.deploy(Congress, 0, 0, 0);
};
