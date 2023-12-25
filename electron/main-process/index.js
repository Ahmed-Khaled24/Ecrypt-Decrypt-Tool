const path = require("node:path");
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    dialog,
    shell,
} = require("electron");
const { message, error } = require("../utils/message.dialogs");
const { send } = require("node:process");
// const { error, errorWithLink } = require("../../utilities/showError");

const handlers = {
    keys: require("./handlers/keys.handler"),
    rsa: require("./handlers/rsa.handler"),
    aes: require("./handlers/aes.handler"),
};

let mainWindow = null;
// Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: "#212529",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        show: false,
    });
    mainWindow.loadFile(
        path.join(__dirname, "../windows/mainWindow/main-window.html"),
    );
    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
        // mainWindow.webContents.openDevTools();
    });
});

ipcMain.on("command", async (event, command, data) => {
    try {
        switch (command) {
            case "generate-rsa-key-pair": {
                // handlers.generateRsaKeyPair(data);
                dialog
                    .showOpenDialog({
                        properties: ["openDirectory"],
                    })
                    .then((result) => {
                        if (!result.canceled) {
                            const directoryPath = result.filePaths[0];
                            handlers.keys.generateRsaKeyPair(directoryPath);
                            message(
                                "Success",
                                "RSA key pair generated successfully!",
                            );
                        }
                    });
                break;
            }
            case "generate-symmetric-key": {
                const key = handlers.keys.generateSymmetricKey();
                mainWindow.webContents.send(
                    "command",
                    "generate-symmetric-key",
                    key,
                );
                break;
            }
            case "rsa": {
                console.log("from rsa");
                console.log(data);
                switch (data.selectedStrategy) {
                    case "encrypt with public key": {
                        handlers.rsa.encryptWithPublicKey(
                            data.inputFilePath,
                            data.publicKeyFilePath,
                        );
                        break;
                    }
                    case "decrypt with private key": {
                        handlers.rsa.decryptWithPrivateKey(
                            data.inputFilePath,
                            data.privateKeyFilePath,
                        );
                        break;
                    }
                    case "sign with private key": {
                        handlers.rsa.signWithPrivateKey(
                            data.inputFilePath,
                            data.privateKeyFilePath,
                        );
                        break;
                    }
                    case "verify with public key": {
                        await handlers.rsa.verifyWithPublicKey(
                            data.inputFilePath,
                            data.publicKeyFilePath,
                        );
                        break;
                    }
                    case "hash-sign-encAes": {
                        await handlers.rsa.hashSignEncrypt(
                            data.inputFilePath,
                            data.privateKeyFilePath,
                            data.symmetricKey,
                        );
                        break;
                    }
                    case "decAes-verify-compare": {
                        await handlers.rsa.decryptVerifyCompare(
                            data.inputFilePath,
                            data.publicKeyFilePath,
                            data.symmetricKey,
                        );
                        break;
                    }
                }
                break;
            }
            case "aes": {
                console.log("from aes");
                console.log(data);
                if (data.type === "encrypt") {
                    handlers.aes.encrypt(
                        data.selectedStrategy,
                        data.inputFilePath,
                        data.symmetricKey,
                    );
                }else if (data.type === "decrypt") {
                    handlers.aes.decrypt(
                        data.selectedStrategy,
                        data.inputFilePath,
                        data.symmetricKey,
                    );
                }
                break;
            }
            default: {
                error("Invalid Operation", "Command Not Found");
                break;
            }
        }
    } catch (err) {
        error("Invalid operation", err);
    }
});

ipcMain.on("error", (event, err) => {
    error("Invalid operation", err);
});
