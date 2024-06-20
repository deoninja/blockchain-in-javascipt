var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];

const nodeAddress = uuidv4().split('-').join('');

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

//Create a new transaction
app.post('/transaction', function (req, res) {
  const blockIndex = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

//Mine a new block
app.get('/mine', function (req, res) {
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock['index'] + 1,
  };

  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = bitcoin.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  bitcoin.createNewTransaction(12.5, '00', nodeAddress);

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
  res.json({
    note: 'New block mined successfully',
    block: newBlock,
  });
});

// Register a node and broadcast it on the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  //.....
});

// Register a node with the network
app.post('/register-node', function (req, res) {});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {});

app.listen(port, function () {
  console.log(`Listening on port ${port}....`);
});
