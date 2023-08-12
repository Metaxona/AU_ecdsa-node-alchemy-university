const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require('ethereum-cryptography/secp256k1')
const { keccak256 } = require('ethereum-cryptography/keccak')
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils')

app.use(cors());
app.use(express.json());

const balances = {
  "0xcb1311c314df06a0877fadeb6e13daad2de697ed": 100,
  "0x72749221697c8138bc3130e02b1269c6e6eb37eb": 50,
  "0x3afa2053e235a7d7579705b9f1d9036e187988fa": 75,
};

const private_keys = {
  "0xcb1311c314df06a0877fadeb6e13daad2de697ed": "fee2399470a1cef82cadefb9fc031c8defa791dcfe546f5cd33dd0cb655b3f2c",
  "0x72749221697c8138bc3130e02b1269c6e6eb37eb": "6bfcc5a3a5849a4110c0a1895e095e0c0639f0bc1bb7444a569a4ad5ac8f25a0",
  "0x3afa2053e235a7d7579705b9f1d9036e187988fa": "a38db2c803e9d0a7ccaf582eb72d66ebc182139970e1f825c88f8f84fbbd9f68",
}

const txHistory = []

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/history", (req, res)=>{
  res.send(JSON.stringify(txHistory))
})

app.get("/balanceAll", (req, res) => {
  res.send(Object.values(balances));
});

app.get("/privateKeyAll", (req, res) => {
  res.send(Object.values(private_keys));
});

app.get("/accounts", (req, res)=>{
  res.send(Object.keys(balances))
})

app.post("/createAccount", (req, res)=>{
  const { privateKey, publicKey } = req.body
  
  balances[`${publicKey}`] = 10
  private_keys[`${publicKey}`] = privateKey
  res.send(JSON.stringify(balances))

})

app.post("/send", (req, res) => {
  const { message, signedMessage, walletAddress } = req.body;
 
  const sign = JSON.parse(signedMessage)
  sign.r = BigInt(sign.r)
  sign.s = BigInt(sign.s)

  const msg = JSON.parse(message)
  const signature = new secp256k1.Signature(sign.r,sign.s, sign.recovery)
  const pubkey = recoverEthPublicKeyFromSignedMessage(signature, message)
  const isSame = pubkey == walletAddress;
  const sender = msg.sender
  const recipient = msg.recipient
  const amount = msg.amount

  if(!Object.keys(balances).includes(sender)) return res.status(400).send({message: "Sender Does Not Exist"})
  if(!Object.keys(balances).includes(recipient)) return res.status(400).send({message: "Recipient Does Not Exist"})

  setInitialBalance(recipient);

  balances[sender] -= amount;
  balances[recipient] += amount;
  res.send({ balance: balances[sender] });
  txHistory.push({sender: sender, recipient: recipient, amount: amount, date: Date.now() })
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if(Object.keys(balances).includes(address)) return;

  if (!balances[address]) {
    balances[address] = 0;
  }
}

function recoverEthPublicKeyFromSignedMessage(signed_msg, message){
  const keccak = keccak256(hexStringToUint8Array(signed_msg.recoverPublicKey(hashMessage(message)).toHex()).slice(1))
  const hex = Array.from(keccak.slice(-20)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${hex}`
}

function hexStringToUint8Array(hexString){
  if (hexString.length % 2 !== 0){
    throw "Invalid hexString";
  }/*from  w w w.  j  av a 2s  . c  o  m*/
  var arrayBuffer = new Uint8Array(hexString.length / 2);

  for (var i = 0; i < hexString.length; i += 2) {
    var byteValue = parseInt(hexString.substr(i, 2), 16);
    if (isNaN(byteValue)){
      throw "Invalid hexString";
    }
    arrayBuffer[i/2] = byteValue;
  }

  return arrayBuffer;
}

function hashMessage(message) {
  return keccak256(utf8ToBytes(message))
}