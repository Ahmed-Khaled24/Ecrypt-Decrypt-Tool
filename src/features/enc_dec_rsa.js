const {
    KeyObject,
    publicEncrypt,
    privateDecrypt,
    createPublicKey,
    constants,
    createPrivateKey
} = require("crypto");

/**
 *
 * @param {string} data  data for encryption
 * @param {KeyObject} publicKey public key for encryption
 * @returns {string} encrypted data in base64
 */
function encryptRSA(data, publicKey) {
    const encryptedData = publicEncrypt(
        {
            key: publicKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(data),
    );
    return encryptedData.toString('base64');
}


/**
 *
 * @param {string} data data for decryption
 * @param {KeyObject} privateKey private key for decryption
 * @returns {string} decrypted data in utf8
 */
function decryptRSA(data, privateKey) {
    const decryptedData = privateDecrypt(
        {
            key: privateKey,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(data, 'base64'),
    );
    return decryptedData.toString('utf8');
}


module.exports = { encryptRSA, decryptRSA };
