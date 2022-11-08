import web3 from "./web3";
const compiledCampaign = require("./build/Campaign.json");

export default (address) => {
  let campaignFactory = new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    address
  );
  return campaignFactory;
}
