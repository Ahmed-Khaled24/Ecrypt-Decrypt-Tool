const AES = require("../../../src/features/aes");
const { error, message } = require("../../utils/message.dialogs");
const { dialog } = require("electron");

/**
 * 
 * @param {string} strategy strategy of aes
 * @param {string} inputFilePath path to the file that you want to encrypt
 * @param {string} symmetricKey key to encrypt the file
 */
function encrypt(strategy, inputFilePath, symmetricKey) {
    try {
        dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
            if (!result.canceled) {
                const outputFilePath = result.filePath;
                const aes = new AES(strategy, symmetricKey, inputFilePath, outputFilePath);
                aes.encrypt((result) => console.log(result));
                message("Success", "File encrypted successfully!");
            }
        });
    } catch (err) {
        error("Invalid operation", "Error in aes encryption");
    }
}

/**
 * 
 * @param {string} strategy strategy of aes
 * @param {string} inputFilePath path to the file that you want to decrypt
 * @param {string} symmetricKey key to decrypt the file
 */
function decrypt(strategy, inputFilePath, symmetricKey) {
    try {
        dialog.showSaveDialog({ properties: ["createFile"] }).then((result) => {
            if (!result.canceled) {
                const outputFilePath = result.filePath;
                const aes = new AES(strategy, symmetricKey, inputFilePath, outputFilePath);
                aes.decrypt((result) => console.log(result));
                message("Success", "File decrypted aes successfully!");
            }
        });
    } catch (err) {
        error("Invalid operation", "Error in aes decryption");
    }
}

module.exports = { encrypt, decrypt };