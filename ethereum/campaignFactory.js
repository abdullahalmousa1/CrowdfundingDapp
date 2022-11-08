import web3 from "./web3";
const compiledFactory = require("./build/CampaignFactory.json");

let campaignFactory = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  "address of deployed contract"
);
export default campaignFactory;
