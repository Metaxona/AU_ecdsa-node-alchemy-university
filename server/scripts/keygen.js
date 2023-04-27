const { secp256k1 } = require('ethereum-cryptography/secp256k1')
const { keccak256 } = require('ethereum-cryptography/keccak')
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils')

const privateKey = secp256k1.utils.randomPrivateKey()
console.log("Private Key: ", toHex(privateKey))

const publicKey = secp256k1.getPublicKey(privateKey)
console.log("Public Key: ", toHex(publicKey))
const keccak = keccak256(publicKey.slice(1))
// console.log("Public Key Keccak256: ", keccak)
const hex = Array.from(keccak.slice(-20)).map((b) => b.toString(16).padStart(2, "0")).join("");
console.log("Public Key Eth: ", `0x${hex}`)

