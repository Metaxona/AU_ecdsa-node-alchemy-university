import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { toHex } from 'ethereum-cryptography/utils'
import { useState } from "react";

function getETHAddressFromPrivateKey(privateKey){
      const publicKey = secp256k1.getPublicKey(privateKey, false)
        
      function getAddress(_publicKey){
          return keccak256(_publicKey.slice(1)).slice(-20)
      }
        
      const address = `0x${toHex(getAddress(publicKey))}`
      
      return  address
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

function Wallet({ address, setAddress, balance, setBalance, privateKey, setprivateKey  }) {
  const [invalidPK, setInvalidPK] = useState("")
  async function onChange(evt) {
    const privateKey = evt.target.value;
    
    setprivateKey(privateKey);
    
    try{
      setInvalidPK("")
      if(!privateKey.match(new RegExp('^[a-fA-F0-9]{64}$'))) throw new Error("Invalid Private Key")
    }
    catch(e){
      setInvalidPK("Invalid Private Key (must be 64 characters long composed of only a-f A-F 0-9)")
      setAddress("")
      return
    }
    setAddress(getETHAddressFromPrivateKey(toHex(hexStringToUint8Array(privateKey))));
    
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Private Key</h1>
      <div>Wallet Address: {address}</div>
      <div className="errormsg">{invalidPK || null}</div>
      <label>
        Private Key
        <input placeholder="" value={privateKey} onBlur={onChange} onChange={onChange}></input>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
