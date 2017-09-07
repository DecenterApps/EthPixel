import contract from './config.json';

let ethPixelContract;

window.onload = () => {
  ethPixelContract = web3.eth.contract(contract.abi).at(contract.contractAddress);
};


export const getAccount = () => {
  if (!web3.eth.accounts || !web3.eth.accounts.length) return false;

  return web3.eth.accounts[0];
};

export const getBlockNumber = () =>
  new Promise((resolve, reject) => {
    web3.eth.getBlockNumber((error, latestBlock) => {
      if (error) {
        return reject(error);
      }

      return resolve(latestBlock);
    });
  });

export const getPixel = (x, y) =>
  new Promise((resolve, reject) => {
    ethPixelContract.pixels((y * 1000) + x, (error, result) => {
      if (error) {
        return reject({
          message: error,
        });
      }

      return resolve(result);
    });
  });

export const _buyPixel = (coordinates, color, amount) =>
  new Promise((resolve, reject) => {
    ethPixelContract.buyPixel(
      coordinates,
      color,
      { value: web3.toWei(amount, 'ether') },
      (error, result) => {
        if (error) {
          return reject({
            message: error,
          });
        }

        return resolve(result);
      });
  });

/* Events */
export const PixelBoughtEvent = async (callback) => {
  let latestBlock = 0;

  try {
    latestBlock = await getBlockNumber();
  } catch (err) {
    return callback(err, null);
  }

  ethPixelContract.PixelBought({}, { fromBlock: latestBlock, toBlock: 'latest' })
    .watch((error, event) => {
      if (error) {
        return callback(error, null);
      }

      return callback(null, event);
    });

  return true;
};

export const GetAllBoughtPixels = (callback) => {
  ethPixelContract.PixelBought({}, { fromBlock: contract.startingBlock, toBlock: 'latest' })
    .get((error, event) => {
      if (error) {
        return callback(error, null);
      }

      return callback(null, event);
    });
};
