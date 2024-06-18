const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const previousBlockhash = '0x123456789012353546546';
const currentBlockData = [
  {
    amount: 10,
    sender: '1654654655665456SDSD',
    recipient: 'LJHLJLJNFDFYHGFKGFOU54',
  },
  {
    amount: 50,
    sender: 'FUYGJHBVLJBLIKBLGKBKJH',
    recipient: '76943272374032784082JKHK',
  },
  {
    amount: 250,
    sender: 'KJHKJGFDGDFXFGFGFXCGFGF',
    recipient: '8465153131GTFGFTFYFGFD',
  },
];

// console.log(bitcoin.proofOfWork(previousBlockhash, currentBlockData));
console.log(bitcoin.hashBlock(previousBlockhash, currentBlockData, 25851));
