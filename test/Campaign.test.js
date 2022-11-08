const assert = require("assert");
const gananche = require("ganache-cli");
const { beforeEach } = require("mocha");
const Web3 = require("web3");
const web3 = new Web3(gananche.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const { describe, it } = require("mocha/lib/mocha");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  let campaigns = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = campaigns[campaigns.length - 1];

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(factory.options.address);
  });

  it("marks caller as a campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows pepole to contribute money and mark them as approvers", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "120", gas: "1000000" });

    const isContributer = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributer);
  });

  it("requires a minmum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[3], value: "80", gas: "1000000" });
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("A new request for our client", "10000000000", accounts[2])
      .send({ from: accounts[0], gas: "1000000" });

    let request = await campaign.methods.requests(0).call();
    assert.ok(request);
  });

  it("End to end test", async () => {
    const targetAccount = accounts[4];

    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: web3.utils.toWei("10", "ether") });

    await campaign.methods
      .createRequest(
        "A new request for our client",
        web3.utils.toWei("5", "ether"),
        targetAccount
      )
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1000000" });

    let request = await campaign.methods.requests(0).call();

    assert.equal(1, request.approvalCount);

    const inittargetBalance = await web3.eth.getBalance(targetAccount);

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    const finalBalance =
      parseInt(inittargetBalance) + parseInt(web3.utils.toWei("5", "ether"));

    assert.equal(finalBalance, await web3.eth.getBalance(targetAccount));
  });
});
