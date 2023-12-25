const crypto = require("crypto");
const fs = require("fs");
/**
 *
 * @param {string} filePath
 * @returns
 */
function generateRsaKeyPair(filePath) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    fs.writeFileSync(
        `${filePath}/private.pem`,
        privateKey.export({ type: "pkcs1", format: "pem" }),
    );
    fs.writeFileSync(
        `${filePath}/public.pem`,
        publicKey.export({ type: "pkcs1", format: "pem" }),
    );
    console.log("Keys generated successfully!");
    return { privateKey, publicKey };
}

function generateSymmetricKey() {
    const passphrase = crypto.randomBytes(32).toString("hex");
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(passphrase, salt, 32);
    console.log(key.toString("hex"));
    return key.toString("hex");
}

module.exports = { generateRsaKeyPair, generateSymmetricKey };
