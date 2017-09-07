/* eslint-disable */
export default () => {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
    return true;
  }

  return false;
};
