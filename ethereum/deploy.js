const HDWalletProvider = require("@truffle/hdwallet-provider");
const factoryContract = require("./build/CampaignFactory.json");
const Web3 = require("web3");

const provider = new HDWalletProvider(
  "add your mnemonic 12 words here",
  "and your infura api here"
);

const web3 = new Web3(provider);
let res;
const deploy = async () => {
    try{
        const accounts = await web3.eth.getAccounts();
         res = await new web3.eth.Contract(JSON.parse(factoryContract.interface))
          .deploy({ data: factoryContract.bytecode })
          .send({ from: accounts[0], gas: "1000000" });
      
        provider.engine.stop();
      
        console.log(res.options.address);
    }catch(error){
        console.log(error);
    }
};

deploy();

