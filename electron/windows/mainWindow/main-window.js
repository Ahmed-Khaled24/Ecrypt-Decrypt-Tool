const { ipcRenderer } = require("electron");

const inputFile = document.getElementById("input-file");
const startBtn = document.getElementById("start-btn");
const keyPairGenerationBtn = document.getElementById("key-pair-generation-btn");

const privateKeyInput = document.getElementById("private-key-input");
const publicKeyInput = document.getElementById("public-key-input");

const symmetricKeyInput = document.getElementById("symmetric-key-input");
const symmetricKeyGenerationBtn = document.getElementById(
    "symmetric-key-generation-btn",
);
const algorithmSelection = document.getElementById("alg-select");
let strategySelection = null;
const subSelectionContainer = document.getElementById("sub-select-container");

const toggleContainer = document.getElementById("toggle-container");
const toggleBtn = document.getElementById("check-aes");

const aesStateText = document.getElementById("aes-state");

let inputFilePath = null;
let privateKeyFilePath = null;
let publicKeyFilePath = null;

const aesOptions = [
    // "aes-128-cbc",
    "aes-128-ecb",
    // "aes-192-cbc",
    "aes-192-ecb",
    // "aes-256-cbc",
    "aes-256-ecb",
];

const rsaOptions = [
    "encrypt with public key",
    "decrypt with private key",
    "sign with private key",
    "verify with public key",
    "hash-sign-encAes",
    "decAes-verify-compare",
];

function sendError(error) {
    ipcRenderer.send("error", error);
}
function renderOptions(options) {
    const subSelection = document.createElement("select");
    subSelection.id = "sub-select";
    subSelectionContainer.innerHTML = "";
    subSelectionContainer.appendChild(subSelection);

    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        subSelection.appendChild(optionElement);
    });
    strategySelection = subSelection;
    console.warn(subSelection);
}

inputFile.addEventListener("change", (event) => {
    inputFilePath = event.target.files[0].path;
});

privateKeyInput.addEventListener("change", (event) => {
    privateKeyFilePath = event.target.files[0].path;
});

publicKeyInput.addEventListener("change", (event) => {
    publicKeyFilePath = event.target.files[0].path;
});

algorithmSelection.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    console.warn(selectedValue);
    let options = [];

    if (selectedValue === "aes") {
        options = aesOptions;
        toggleContainer.style.display = "block";
    } else if (selectedValue === "rsa") {
        options = rsaOptions;
        toggleContainer.style.display = "none";
    }
    console.warn(options);

    renderOptions(options);
});

toggleBtn.addEventListener("change", (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
        aesStateText.textContent = "DEC";
    } else {
        aesStateText.textContent = "ENC";
    }
});

symmetricKeyGenerationBtn.addEventListener("click", () => {
    ipcRenderer.send("command", "generate-symmetric-key");
});

keyPairGenerationBtn.addEventListener("click", (event) => {
    ipcRenderer.send("command", "generate-rsa-key-pair");
});

startBtn.addEventListener("click", () => {
    const selectedAlgorithm = algorithmSelection.value;
    const selectedStrategy = strategySelection.value;
    const symmetricKey = symmetricKeyInput.value;

    if (!inputFilePath) {
        sendError("Please select an input file");
        return;
    }
    if (selectedAlgorithm === "rsa" && !privateKeyFilePath) {
        sendError("Please select a private key");
        return;
    }
    if (selectedAlgorithm === "rsa" && !publicKeyFilePath) {
        sendError("Please select a public key");
        return;
    }
    if (!symmetricKey) {
        sendError("Please generate a symmetric key");
        return;
    }
    if (!selectedAlgorithm) {
        sendError("Please select an algorithm");
        return;
    }
    if (!selectedStrategy) {
        sendError("Please select a strategy");
        return;
    }

    ipcRenderer.send("command", selectedAlgorithm, {
        selectedStrategy,
        inputFilePath,
        symmetricKey,
        privateKeyFilePath,
        publicKeyFilePath,
        type: aesStateText.textContent === "ENC" ? "encrypt" : "decrypt",
    });
});

renderOptions(aesOptions);

ipcRenderer.on("command", (event, command, data) => {
    switch (command) {
        case "generate-symmetric-key": {
            symmetricKeyInput.value = data;
            break;
        }
        default: {
            sendError("Invalid command");
        }
    }
});
