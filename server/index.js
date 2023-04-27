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
  "0x876d3144e83d04e5fbf35492b5009f0347fba051": 100,
  "0xbfb9dffcae8a8abd48b41042af4e7615327a79f9": 50,
  "0x416406034998cf1e91cb8075b7242f533e312cac": 75,
};

const private_keys = {
  "0x876d3144e83d04e5fbf35492b5009f0347fba051": "f87f2ceccc2c926ce4b892b7558489f59be5d30605b21a38493c1a3283fe3736",
  "0xbfb9dffcae8a8abd48b41042af4e7615327a79f9": "4d634e99eaeb2b3dba62a6366fe9afe58bd77ed7719bc38f836e94328451d66b",
  "0x416406034998cf1e91cb8075b7242f533e312cac": "d2d60f48e73bca2ce3b1b547b0004427fabb9a2c0c7ba24b55b6b6362135981d",
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