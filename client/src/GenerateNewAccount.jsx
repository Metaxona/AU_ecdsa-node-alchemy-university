import server from "./server";
import { useState } from "react";

import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils';

function NewAccount({fetchData, setFetchData}) {
    const [newAccount, setNewAccount] = useState({});
    
    function generatepupriv(){
        const privateKey = secp256k1.utils.randomPrivateKey()
        const publicKey = secp256k1.getPublicKey(privateKey)
        const keccak = keccak256(publicKey.slice(1))
        const hex = Array.from(keccak.slice(-20)).map((b) => b.toString(16).padStart(2, "0")).join("");
        
        return {
            privateKey: toHex(privateKey),
            publicKey: `0x${hex}`
        }
    }
    async function newaccount(evt){
    evt.preventDefault()
    setFetchData(true)
    try{
        const nacc = generatepupriv()
        setNewAccount(nacc)
        const { data } = await server.post("createAccount", nacc)
    }
    catch(ex){
        alert(ex.message || ex.response.data.message || ex);
    }
  }


  return (
    <div className="container newAccount">
      <h1>Gennerate New Account</h1>

      <label>
            <button className="button" onClick={newaccount}>New Account</button>
      </label> 

        <div>Wallet Address: {newAccount.publicKey || ""} Private Key: {newAccount.privateKey || ""}</div>

    </div>);
}

export default NewAccount;
