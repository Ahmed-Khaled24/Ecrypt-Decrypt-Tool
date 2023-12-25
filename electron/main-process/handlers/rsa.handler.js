const fs = require("fs");
const { sign, verify } = require("../../../src/features/sign-verify");
const {
    decrypt_verify,
    encrypt_sign,
} = require("../../../src/features/encrypt-sign_decrypt-verify");
const { message, error } = require("../../utils/message.dialogs");
const { encryptRSA, decryptRSA } = require("../../../src/features/enc_dec_rsa");
const { dialog } = require("electron");

/**
 *
 * @param {string} inputDataFilePath path to the file that you want to encrypt
 * @param {string} publicKeyPath path to the public key
 */
async function encryptWithPublicKey(inputDataFilePath, publicKeyPath) {
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");
    const inputData = fs.readFileSync(inputDataFilePath, "utf8");

    const encryptedData = encryptRSA(inputData, publicKey);

    dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
        if (!result.canceled) {
            const directoryPath = result.filePath;
            fs.writeFileSync(directoryPath, encryptedData);
            message("Success", "File encrypted with public key successfully!");
        }
    });
}

/**
 *
 * @param {string} inputDataFilePath path to the file that you want to decrypt
 * @param {string} privateKeyPath path to the private key
 */
async function decryptWithPrivateKey(inputDataFilePath, privateKeyPath) {
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const inputData = fs.readFileSync(inputDataFilePath, "utf8");

    const decryptedData = decryptRSA(inputData, privateKey);

    dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
        if (!result.canceled) {
            const directoryPath = result.filePath;
            fs.writeFileSync(directoryPath, decryptedData);
            message("Success", "File decrypted with private key successfully!");
        }
    });
}

/**
 *
 * @param {string} inputData
 * @param {string} privateKeyPath
 */
async function signWithPrivateKey(inputDataFilePath, privateKeyPath) {
    const inputFileName = inputDataFilePath.split("\\").pop();
    const privateKey = fs.readFileSync(privateKeyPath);
    const inputData = fs.readFileSync(inputDataFilePath);
    let signature = sign(inputData, privateKey);
    signature = Buffer.concat([
        inputData,
        Buffer.from("\n#SIGNATURE#", "binary"),
        signature,
    ]);

    dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
        if (!result.canceled) {
            const directoryPath = result.filePath;
            fs.writeFileSync(directoryPath, signature);
            message("Success", "File signed with private key successfully!");
        }
    });
}

async function verifyWithPublicKey(signedDataFilePath, publicKeyPath) {
    const signedData = fs.readFileSync(signedDataFilePath);
    const publicKey = fs.readFileSync(publicKeyPath);

    const fileData = fs.readFileSync(signedDataFilePath, "binary");
    let [actualData, signature] = fileData.split("\n#SIGNATURE#");

    const validSignature = verify(actualData, publicKey, signature);
    if (validSignature) {
        message("Success", "File verified with public key successfully!");
        // dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
        //     if (!result.canceled) {
        //         const directoryPath = result.filePath;
        //         fs.writeFileSync(directoryPath, signature);
        //     }
        // });
    } else {
        error("Invalid Signature", "The signature is invalid");
    }
}

async function hashSignEncrypt(
    inputDataFilePath,
    privateKeyPath,
    symmetricKey,
) {
    const { canceled, filePath: outputFilePath } =
        await dialog.showSaveDialog();
    if (canceled) {
        return;
    }
    await encrypt_sign(
        privateKeyPath,
        symmetricKey,
        inputDataFilePath,
        outputFilePath,
    );
    message("Success", "File signed and encrypted successfully!");
}

async function decryptVerifyCompare(
    inputDataFilePath,
    publicKeyPath,
    symmetricKey,
) {
    dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
        if (!result.canceled) {
            const destinationPath = result.filePath;
            console.log(destinationPath);
            decrypt_verify(
                publicKeyPath,
                symmetricKey,
                inputDataFilePath,
                destinationPath,
            ).then((result) => {
                if (result) {
                    message(
                        "Success",
                        "File decrypted and verified successfully!",
                    );
                }
            });
        }
    });
}

module.exports = {
    encryptWithPublicKey,
    decryptWithPrivateKey,
    signWithPrivateKey,
    verifyWithPublicKey,
    hashSignEncrypt,
    decryptVerifyCompare,
};
