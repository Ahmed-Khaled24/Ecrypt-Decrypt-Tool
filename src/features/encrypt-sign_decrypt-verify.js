const { KeyObject } = require("crypto");
const { readFileSync } = require("fs");
const { readFile, writeFile } = require("fs/promises");
const { generateHash } = require("./sha512");
const { join } = require("path");
const { sign, verify } = require("./sign-verify");
const AES = require("./aes");

/**
 * @param {KeyObject | string} privateKey rsa private key
 * @param {string} symmetricKey key to the aes algorithm
 * @param {string} sourcePath absolute path to the file that you want to encrypt and sign
 * @param {string} targetPath absolute path to the file that will be generated with the result of decryption and singing
 */
async function encrypt_sign(privateKey, symmetricKey, sourcePath, targetPath) {
    return new Promise(async (resolve, reject) => {
        const fileData = await readFile(sourcePath, "binary");
        const fileHash = generateHash(fileData);

        let signature = sign(fileHash, privateKey);

        signature = Buffer.concat([
            Buffer.from("\n#SIGNATURE#", "binary"),
            signature,
        ]);

        await writeFile(sourcePath, signature, {
            flag: "a",
            encoding: "binary",
        });

        const aes = new AES(
            "aes-256-ecb",
            symmetricKey,
            sourcePath,
            targetPath,
        );

        aes.encrypt(async (resultBoolean) => {
            if (resultBoolean) {
                console.log("Your file has been signed and encrypted");
                await cleanup(sourcePath);
                resolve(true);
            } else {
                reject();
            }
        });
    });
}

/**
 * @param {KeyObject | string} publicKey rsa public key
 * @param {string} symmetricKey key to the aes algorithm
 * @param {string} sourcePath absolute path to the file that you want to decrypt and verify
 * @param {string} targetPath absolute path to the file that will be generated with the result of decryption
 */
async function decrypt_verify(publicKey, symmetricKey, sourcePath, targetPath) {
    return new Promise((resolve, reject) => {
        const aes = new AES(
            "aes-256-ecb",
            symmetricKey,
            sourcePath,
            targetPath,
        );
        aes.decrypt(async (resultBoolean) => {
            console.log(
                resultBoolean
                    ? "Your file has been decrypted"
                    : reject("The code has been exploded"),
            );

            const fileData = await readFile(targetPath, "binary");
            let [actualData, signature] = fileData.split("\n#SIGNATURE#");

            const fileHash = generateHash(actualData);

            const validSignature = verify(fileHash, publicKey, signature);

            if (validSignature) {
                console.log("Your file signature is valid.");
                await writeFile(targetPath, actualData, { flag: "w" });
                resolve(true);
            } else {
                reject("Your file signature is invalid.");
            }
        });
    });
}

/**
 * helper function to clean up the original file from the signature
 * @param {string} filePath absolute path
 * @returns
 */
async function cleanup(filePath) {
    const fileData = await readFile(filePath, "binary");
    let [actualData, signature] = fileData.split("\n#SIGNATURE#");
    await writeFile(filePath, actualData);
    return true;
}

module.exports = {
    encrypt_sign,
    decrypt_verify,
};
