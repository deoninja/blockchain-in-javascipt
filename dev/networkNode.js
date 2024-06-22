var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];
const axios = require('axios');

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
  const newTransaction = req.body;
  const blockIndex =
    bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({
    note: `Transaction will be added in block ${blockIndex}.`,
  });
});

app.post('/transaction/broadcast', function (req, res) {
  const newTransaction = bitcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      url: networkNodeUrl + '/transaction',
      method: 'post',
      data: newTransaction,
    };
    requestPromises.push(axios(requestOptions));
  });

  Promise.all(requestPromises).then((data) => {
    res.json({
      note: 'Transaction created and broadcast successfully',
    });
  });
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

  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      url: networkNodeUrl + '/receive-new-block',
      method: 'post',
      data: {
        newBlock: newBlock,
      },
    };
    requestPromises.push(axios(requestOptions));
  });
  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        url: bitcoin.currentNodeUrl + '/transaction/broadcast',
        method: 'post',
        data: {
          amount: 12.5,
          sender: '00',
          recipient: nodeAddress,
        },
      };
      return axios(requestOptions);
    })
    .then((data) => {
      res.json({
        note: 'New block mined and broadcast successfully',
        block: newBlock,
      });
    });
});

app.post('/receive-new-block', function (req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({ note: 'New block received and accepted', newBlock: newBlock });
  } else {
    res.json({ note: 'New block rejected', newBlock: newBlock });
  }
});

// //register a node and broadcast it in the whole networks
// app.post('/register-and-broadcast-node', function (req, res) {
//   const newNodeUrl = req.body.newNodeUrl;
//   if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
//     bitcoin.networkNodes.push(newNodeUrl);
//   }
//   const regNodesPromises = [];
//   bitcoin.networkNodes.forEach((networkNodeUrl) => {
//     // register-node
//     const requestOptions = {
//       url: networkNodeUrl + '/register-node',
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data: { newNodeUrl: networkNodeUrl },
//     };
//     regNodesPromises.push(axios(requestOptions));
//   });

//   Promise.all(regNodesPromises)
//     .then((data) => {
//       const bulkRegisterOptions = {
//         url: newNodeUrl + '/register-nodes-bulk',
//         method: 'post',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         data: {
//           allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
//         },
//       };
//       return axios(bulkRegisterOptions);
//     })
//     .then((data) => {
//       res.json({ note: 'New node registered with network successfully' });
//     });
// });
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  const regNodesPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    if (networkNodeUrl !== newNodeUrl) {
      // Skip sending to the new node itself
      const requestOptions = {
        url: networkNodeUrl + '/register-node',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { newNodeUrl },
      };
      regNodesPromises.push(axios(requestOptions));
    }
  });

  Promise.all(regNodesPromises) // Use Promise.all for error handling (optional)
    .then(() => {
      const bulkRegisterOptions = {
        url: newNodeUrl + '/register-nodes-bulk',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
        },
      };
      return axios(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: 'New node registered with network successfully' });
    })
    .catch((error) => {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Registration failed' }); // Handle errors
    });
});

// Register a node with the network
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
  if (nodeNotAlreadyPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }
  res.json({ note: 'New node registered successfully' });
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
      bitcoin.networkNodes.push(networkNodeUrl);
  });

  res.json({ note: 'Bulk registration successful.' });
});

// Get entire blockchain
app.get('/consensus', function (req, res) {
  const requestPromises = [];
  bitcoin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      url: networkNodeUrl + '/blockchain',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    requestPromises.push(axios(requestOptions).catch((error) => null)); // Catch errors and return null
  });

  Promise.all(requestPromises)
    .then((responses) => {
      const blockchains = responses.map((response) =>
        response ? response.data : null
      ); // Extract data or null
      const currentChainLength = bitcoin.chain.length;
      let maxChainLength = currentChainLength;
      let newLongestChain = null;
      let newPendingTransactions = null;

      blockchains.forEach((blockchain) => {
        if (
          blockchain &&
          blockchain.chain &&
          blockchain.chain.length > maxChainLength
        ) {
          maxChainLength = blockchain.chain.length;
          newLongestChain = blockchain.chain;
          newPendingTransactions = blockchain.pendingTransactions;
        }
      });

      if (
        !newLongestChain ||
        (newLongestChain && !bitcoin.chainIsValid(newLongestChain))
      ) {
        res.json({
          note: 'Current chain has not been replaced.',
          chain: bitcoin.chain,
        });
      } else {
        bitcoin.chain = newLongestChain;
        bitcoin.pendingTransactions = newPendingTransactions;
        res.json({
          note: 'This chain has been replaced.',
          chain: bitcoin.chain,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        note: 'An error occurred while trying to reach consensus.',
        error: error.message,
      });
    });
});

app.get('/block/:blockHash', function (req, res) {});

app.get('/transaction/:transactionId', function (req, res) {});

app.get('/address/:addresss', function (req, res) {});

app.listen(port, function () {
  console.log(`Listening on port ${port}....`);
});
