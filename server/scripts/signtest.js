const { secp256k1 } = require('ethereum-cryptography/secp256k1')
const { keccak256 } = require('ethereum-cryptography/keccak')
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils')

function hashMessage(message) {
    return keccak256(utf8ToBytes(message))
}
  
function signMessage(msg, priv_key) {
return secp256k1.sign(hashMessage(msg), priv_key)
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

function recoverEthPublicKeyFromSignedMessage(signed_msg, message){
    const keccak = keccak256(hexStringToUint8Array(signed_msg.recoverPublicKey(hashMessage(message)).toHex()).slice(1))
    const hex = Array.from(keccak.slice(-20)).map((b) => b.toString(16).padStart(2, "0")).join("");
    return `0x${hex}`
}

function getETHAddressFromPrivateKey(privateKey){
  return "0x" + toHex(keccak256(secp256k1.getPublicKey(privateKey).slice(1)).slice(-20))
}

// console.log(getETHAddressFromPrivateKey("f87f2ceccc2c926ce4b892b7558489f59be5d30605b21a38493c1a3283fe3736"))