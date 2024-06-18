const sha256 = require('sha256');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function (
  nonce,
  previousBlockhash,
  hash
) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce: nonce,
    hash: hash,
    previousBlockhash: previousBlockhash,
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);
  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient,
  };
  this.pendingTransactions.push(newTransaction);
  return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function (
  previousBlockhash,
  currentBlockData,
  nonce
) {
  const dataAsString =
    previousBlockhash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

Blockchain.prototype.proofOfWork = function (
  previousBlockhash,
  currentBlockData
) {
  // bitcoin.hashBlock(previousBlockhash, currentBlockData, nonce);
  // => repeatedly hash block until it finds correct hash => '0000OXDCKGFKGGFKJGFJJJGFJFJ'
  // => useus current block data to create hash, but also the previousBlockhash
  // => continously changes nonce value until it finds the correct hash
  // => returns to us the nonce that creates the correct hash
};

module.exports = Blockchain;
