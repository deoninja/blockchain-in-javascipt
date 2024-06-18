const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(2389, '0IJMNBGFGFGFHG', '90FFJJLJHJJLHJHYT');
bitcoin.createNewBlock(4587, 'HSHDHSD:SHDSHD', 'WUIOEU{UPWPKLKJKK');
bitcoin.createNewBlock(2430, 'QPOOKSKHUIDSHD', 'POPBJHGFGGHGHGHGH');

console.log(bitcoin);
