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

    const aes = new AES("aes-256-ecb", symmetricKey, sourcePath, targetPath);
    aes.encrypt(async (resultBoolean) => {
        resultBoolean && console.log("Your file has been signed and encrypted");
    });
}

/**
 * @param {KeyObject | string} publicKey rsa public key
 * @param {string} symmetricKey key to the aes algorithm
 * @param {string} sourcePath absolute path to the file that you want to decrypt and verify
 * @param {string} targetPath absolute path to the file that will be generated with the result of decryption
 */
async function decrypt_verify(publicKey, symmetricKey, sourcePath, targetPath) {
    const aes = new AES("aes-256-ecb", symmetricKey, sourcePath, targetPath);
    aes.decrypt(async (resultBoolean) => {
        console.log(
            resultBoolean
                ? "Your file has been decrypted"
                : "The code has been exploded",
        );

        const fileData = await readFile(targetPath, "binary");
        let [actualData, signature] = fileData.split("\n#SIGNATURE#");

        const fileHash = generateHash(actualData);

        const validSignature = verify(fileHash, publicKey, signature);

        if (validSignature) {
            console.log("Your file signature is valid.");
            await writeFile(targetPath, actualData, { flag: "w" });
        } else {
            console.log("Your file signature is invalid.");
        }
    });
}

(async () => {
    const privateKey = readFileSync(
        join(__dirname, "./default-keys/private.pem"),
        "utf-8",
    );
    const publicKey = readFileSync(
        join(__dirname, "./default-keys/public.pem"),
        "utf-8",
    );

    const symmetricKey = "I am very strong";

    await encrypt_sign(
        privateKey,
        symmetricKey,
        join(__dirname, "test.txt"),
        join(__dirname, "test-encrypted.txt"),
        publicKey,
    );

    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    await decrypt_verify(
        publicKey,
        symmetricKey,
        join(__dirname, "test-encrypted.txt"),
        join(__dirname, "test-decrypted.txt"),
    );
})();
