const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  "stage prison human spoon abandon budget siren two arena cradle prize spoil",
  "https://sepolia.infura.io/v3/d67137a23ca44c4da842cc910c7de69f"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const contractResult = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "1500000", from: accounts[0] });

  console.log("Contract deployed to", contractResult.options.address);
  provider.engine.stop();
};

deploy();