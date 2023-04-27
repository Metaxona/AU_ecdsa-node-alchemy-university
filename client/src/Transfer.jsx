import { useState, useEffect } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils'

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

function Transfer({ address, balance, setBalance, privateKey, setFetchData }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipient] = useState("");
  const [transferData, setTransferData] = useState({});
  const [signedMessage, setSignedMessage] = useState(null);
  const [errMessageAmt, setErrMessageAmt] = useState(null);
  const [errMessageRA, setErrMessageRA] = useState(null);
  const [buttonState, setButtonState] = useState(true);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  useEffect(()=>{
    if(!sendAmount || !recipientAddress || !privateKey){
      setButtonState(true)
    }
    else{
      setButtonState(false)
    }
    return ()=>{}
  }, [sendAmount, recipientAddress, privateKey])

  async function transfer(evt) {
    evt.preventDefault();
    try {
      if(!sendAmount || !recipientAddress) throw new Error("No Amount or Recipient")
      
      const { data: { balance }, } = await server.post(`send`, 
      {
        message: JSON.stringify(transferData),
        signedMessage: signedMessage,
        walletAddress: address
      }
      );
      
      setBalance(balance);
      setFetchData(true);
    } catch (ex) {
      alert(ex.response.data.message || ex.message);
    }
  }

  function onChange(evt){
    
    setTransferData({ sender: address, amount: parseInt(sendAmount), recipient: recipientAddress })  
    
    const hexPriv = toHex(hexStringToUint8Array(privateKey))
    
    const signedData = signMessage(JSON.stringify(transferData), hexPriv)
    signedData.r = BigInt(signedData.r).toString()
    signedData.s = BigInt(signedData.s).toString()
    signedData.recovery = signedData.recovery
    
    setSignedMessage(JSON.stringify(signedData))
  }

  function amount(e){
    const amount = e.target.value
    
    if(amount == 0) {setErrMessageAmt(`Amount Can NOT Be 0`)}
    else if(!parseFloat(amount)) {setErrMessageAmt(`${amount} Is NOT a Valid Amount`)}
    else if(amount > balance) {setErrMessageAmt(`${amount} Exceeded Your Current Balance`)}
    else{setErrMessageAmt("")}
    setSendAmount(amount)

    if(amount && recipientAddress){setButtonState(false)}
  }

  function recipient(e){
    const recipient = e.target.value
    if(recipient.length > 42 || !recipient.match(new RegExp('^0x[a-fA-F0-9]{40}$'))){setErrMessageRA("Invalid Ethereum Address")}
    else if(recipient == address){setErrMessageRA("Can NOT Send To Self")}
    else{setErrMessageRA("")}

    setRecipient(recipient)
    if(amount && recipientAddress){setButtonState(false)}

  }


  return (
    <form className="container transfer" onSubmit={transfer} onBlur={onChange} onChange={onChange}>
      <h1>Send Transaction</h1>
      
      <label>
        Send Amount
        <div className="errormsg">{errMessageAmt}</div>
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={amount}
          onBlur={amount}
        ></input>
      </label>

      <label>
        Recipient
        <div className="errormsg">{errMessageRA}</div>
        <input
          placeholder="Type an address, for example: 0x876d3144e83d04e5fbf35492b5009f0347fba051"
          value={recipientAddress}
          onChange={recipient}
          onBlur={recipient}
        ></input>
      </label>

      <input type="submit" disabled={buttonState} className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
