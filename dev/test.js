const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1718980340498,
      transactions: [],
      nonce: 100,
      hash: '0',
      previousBlockHash: '0',
    },
    {
      index: 2,
      timestamp: 1718980364960,
      transactions: [],
      nonce: 18140,
      hash: '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100',
      previousBlockHash: '0',
    },
    {
      index: 3,
      timestamp: 1718980447176,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ec4eba46eb8b490bb06ad09e22a930ba',
          transactionId: '04882e14940248209ed11132f8a09287',
        },
        {
          amount: 10,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: 'befee544790e4acb8e64586fd80cbdec',
        },
        {
          amount: 20,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: '7fe1584d050040df9b4b7e4d7fb91c74',
        },
        {
          amount: 30,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: '1a46f90d25744b55a415258ac76833ec',
        },
      ],
      nonce: 141262,
      hash: '0000cf244fbd678af5e95f9fb853bc31b56aea794b991d4bcfba201c28deb888',
      previousBlockHash:
        '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100',
    },
    {
      index: 4,
      timestamp: 1718980490373,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ec4eba46eb8b490bb06ad09e22a930ba',
          transactionId: '6652d4ebb3fa49daa290614ab3a06f8a',
        },
        {
          amount: 40,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: 'a5b8023b984f41a4b1ea16d9ffc524b0',
        },
        {
          amount: 50,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: 'dca6618c53e0439ba0c3db75e7168294',
        },
        {
          amount: 60,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: '7080c0fb3ae141209354159231e8757c',
        },
        {
          amount: 70,
          sender: 'UIOUYPO56465454JHLK',
          recipient: 'PPPKJLKJ87878654',
          transactionId: 'c4a6fa49d931470aaf7896d14e2d0b59',
        },
      ],
      nonce: 66454,
      hash: '0000275d035c0cd5219f6a047598c1063edda3d3d227d398a7c56b188fb42d30',
      previousBlockHash:
        '0000cf244fbd678af5e95f9fb853bc31b56aea794b991d4bcfba201c28deb888',
    },
    {
      index: 5,
      timestamp: 1718980536332,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ec4eba46eb8b490bb06ad09e22a930ba',
          transactionId: '44784963fef24c70920981063e171587',
        },
      ],
      nonce: 43878,
      hash: '000066d98dfd020db23e96e89f15409203be5b5d9b5039eb45fd338a7f10fc85',
      previousBlockHash:
        '0000275d035c0cd5219f6a047598c1063edda3d3d227d398a7c56b188fb42d30',
    },
    {
      index: 6,
      timestamp: 1718980539739,
      transactions: [
        {
          amount: 12.5,
          sender: '00',
          recipient: 'ec4eba46eb8b490bb06ad09e22a930ba',
          transactionId: 'd9b702889dbe41b2ad40651288195672',
        },
      ],
      nonce: 79618,
      hash: '00004875fcd1fb1468f5ccb52f35290a9586177be9bb10c5152f82509a773aa2',
      previousBlockHash:
        '000066d98dfd020db23e96e89f15409203be5b5d9b5039eb45fd338a7f10fc85',
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: '00',
      recipient: 'ec4eba46eb8b490bb06ad09e22a930ba',
      transactionId: 'da5971eba8034ae19ffb52216bad9574',
    },
  ],
  currentNodeUrl: 'http://localhost:3001',
  networkNodes: [],
};

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));
