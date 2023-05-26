import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factory = new web3.eth.Contract(CampaignFactory.abi, '0x9C6AD0B667d4e11dc92C8194fe307D041879E488');

export default factory;