const ArtistReward = artifacts.require("ArtistReward");

module.exports = function (deployer) {
  deployer.deploy(ArtistReward);
};
