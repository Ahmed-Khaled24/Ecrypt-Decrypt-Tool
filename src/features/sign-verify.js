const { createSign, createVerify, KeyObject } = require("node:crypto");

/**
 * @param {string} data
 * @param {KeyObject} privateKey
 * @returns
 */
function sign(data, privateKey) {
    const signer = createSign("RSA-SHA256");
    signer.update(data);
    signer.end();
    return signer.sign(privateKey);
}

/**
 * @param {string} data
 * @param {KeyObject} publicKey
 * @param {Buffer} signature
 * @returns
 */
function verify(data, publicKey, signature) {
    const verifier = createVerify("RSA-SHA256");
    verifier.update(data);
    verifier.end();
    return verifier.verify(publicKey, signature);
}

module.exports = { sign, verify };
