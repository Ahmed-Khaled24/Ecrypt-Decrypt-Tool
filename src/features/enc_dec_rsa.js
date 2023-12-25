const { KeyObject, publicEncrypt, privateDecrypt } = require("crypto");

/**
 *
 * @param {string} data  data for encryption
 * @param {KeyObject} publicKey public key for encryption
 * @returns
 */
function encryptRSA(data, publicKey) {
    const encryptedData = publicEncrypt(publicKey, Buffer.from(data));
    return encryptedData.toString("base64");
}

/**
 *
 * @param {string} data data for decryption
 * @param {KeyObject} privateKey private key for decryption
 * @returns
 */
function decryptRSA(data, privateKey) {
    const decryptedData = privateDecrypt(
        privateKey,
        Buffer.from(data, "base64"),
    );
    return decryptedData.toString();
}

module.exports = { encryptRSA, decryptRSA };
