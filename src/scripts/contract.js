const ethers = require('ethers');

const executeDeposit = async (provider, amount, network, pubKey, targetAccount) => {
  const { contract, txCount } = await instantiateTicketVendor(provider, pubKey, network);
  const event = await requestTicket(contract, amount, txCount, pubKey, provider, network);
  const { bridgeContract, txCount2 } = await instantiateForeignBridge(provider, pubKey, network);
  const txHash = await executeTicket(bridgeContract, amount, event.ticketId, txCount2, pubKey, provider, network, targetAccount);
  debugger;
  return { txHash, contract };
};

const instantiateTicketVendor = async (provider, pubKey, network) => {
  const txCount = await provider.getTransactionCount(pubKey);
  const abi = [{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"requestTicket","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTicketCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newPriceMaxAge","type":"uint256"}],"name":"setPriceMaxAge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getUpdatePriceCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"updatePrice","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getQuery","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newQuery","type":"string"}],"name":"setQuery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPriceMaxAge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentPrice","outputs":[{"name":"eveWeiPerEther","type":"uint256"},{"name":"lastUpdated","type":"uint256"},{"name":"okay","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ticketId","type":"uint256"}],"name":"getTicketInfo","outputs":[{"name":"owner","type":"address"},{"name":"price","type":"uint256"},{"name":"issued","type":"uint256"},{"name":"value","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"requester","type":"address"},{"indexed":true,"name":"ticketId","type":"uint256"}],"name":"TicketCreated","type":"event"}]
  const signer = provider.getSigner();
  let contract = new ethers.Contract('0x2F9585cE749C00a148f6110b02fc8d1C1Ab33Ca0', abi, signer);
  return { contract, txCount, signer };
};

const instantiateForeignBridge = async (provider, pubKey, network) => {
  const txCount2 = await provider.getTransactionCount(pubKey);
  const abi = [{"constant":true,"inputs":[{"name":"_txHash","type":"bytes32"}],"name":"relayedMessages","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"vs","type":"uint8[]"},{"name":"rs","type":"bytes32[]"},{"name":"ss","type":"bytes32[]"},{"name":"message","type":"bytes"}],"name":"executeSignatures","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_day","type":"uint256"}],"name":"totalSpentPerDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isInitialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"chargeFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getCurrentDay","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"requiredBlockConfirmations","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dailyLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"claimFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_to","type":"address"}],"name":"claimTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"requiredSignatures","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"validatorContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deployedAtBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBridgeInterfacesVersion","outputs":[{"name":"major","type":"uint64"},{"name":"minor","type":"uint64"},{"name":"patch","type":"uint64"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"_minPerTx","type":"uint256"}],"name":"setMinPerTx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blockConfirmations","type":"uint256"}],"name":"setRequiredBlockConfirmations","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_dailyLimit","type":"uint256"}],"name":"setDailyLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_gasPrice","type":"uint256"}],"name":"setGasPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_maxPerTx","type":"uint256"}],"name":"setMaxPerTx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"minPerTx","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withinLimit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxPerTx","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"UserRequestForAffirmation","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"transactionHash","type":"bytes32"}],"name":"RelayedMessage","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gasPrice","type":"uint256"}],"name":"GasPriceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"requiredBlockConfirmations","type":"uint256"}],"name":"RequiredBlockConfirmationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newLimit","type":"uint256"}],"name":"DailyLimitChanged","type":"event"},{"constant":false,"inputs":[{"name":"_validatorContract","type":"address"},{"name":"_dailyLimit","type":"uint256"},{"name":"_maxPerTx","type":"uint256"},{"name":"_minPerTx","type":"uint256"},{"name":"_foreignGasPrice","type":"uint256"},{"name":"_requiredBlockConfirmations","type":"uint256"},{"name":"_ticketVendor","type":"address"},{"name":"ticketMaxAge","type":"uint256"}],"name":"initialize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ticketId","type":"uint256"},{"name":"targetAccount","type":"address"}],"name":"transferFunds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"ticketMaxAge","type":"uint256"}],"name":"setTicketMaxAge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"ticketVendor","type":"address"}],"name":"setTicketVendor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getBridgeMode","outputs":[{"name":"_data","type":"bytes4"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"getTicketMaxAge","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"ticketId","type":"uint256"}],"name":"getTicketProcessed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTicketVendor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
  const signer = provider.getSigner();
  let bridgeContract = new ethers.Contract('0x36704A8F00d6bB9Bff641c4EDA1EB4cb3EEd65F6', abi, signer);
  return { bridgeContract, txCount2, signer };
};

const executeTicket = async (contract, amount, ticketId, txCount, pubKey, provider, network, targetAccount) => {
  const wei = ethers.utils.parseEther(amount);
  const overrideOptions = {
    gasLimit: 250000,
    gasPrice: 100000000000,
    nonce: txCount,
    value: wei,
  };
  let tx = await contract.functions.transferFunds(ticketId, targetAccount, overrideOptions);
  return tx.hash;
};


const requestTicket = async (contract, amount, txCount, pubKey, provider, network) => {
  return new Promise(async (resolve) => {
    const wei = ethers.utils.parseEther(amount);
    const overrideOptions = {
      gasLimit: 250000,
      gasPrice: 100000000000,
      nonce: txCount,
      //value: wei,
    };
    let filter = contract.filters.TicketCreated(pubKey, null);
    contract.once(filter, (sender, ticketId, eventData) => {
      resolve({
        sender,
        ticketId,
        eventData
      });
    });
    let tx = await contract.functions.requestTicket(wei, overrideOptions);
  })

};


export default executeDeposit;

