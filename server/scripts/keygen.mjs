import { secp256k1 } from 'ethereum-cryptography/secp256k1.js'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { toHex } from 'ethereum-cryptography/utils.js'

const privateKey = secp256k1.utils.randomPrivateKey()
const publicKey = secp256k1.getPublicKey(privateKey, false)

function getAddress(_publicKey){
    return keccak256(_publicKey.slice(1)).slice(-20)
}

const address = `0x${toHex(getAddress(publicKey))}`

console.log("Private Key: ", toHex(privateKey))
console.log("ETH Address: ", address)

