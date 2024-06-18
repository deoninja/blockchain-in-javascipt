const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(2389, '0IJMNBGFGFGFHG', '90FFJJLJHJJLHJHYT');

bitcoin.createNewTransaction(500, '0IJKJHJHJ456456JHJH', '0IJHJHJHJHJH56H');

bitcoin.createNewBlock(54845, '0IJMN556621FHG', '90FFJJLJ56564658T');

bitcoin.createNewTransaction(100, '0IJKJHJ98796546651', '0IJ324233242HJH56H');
bitcoin.createNewTransaction(400, '0IJKJHJHJ456456JHJH', '0IJ5465465156256H');
bitcoin.createNewTransaction(500, '0IJKJ54654645656JHJH', '0IJ21687465165156H');

bitcoin.createNewBlock(54823445, '0I3590456621FHG', '90FFJ8787878758T');

console.log(bitcoin.chain[2]);
