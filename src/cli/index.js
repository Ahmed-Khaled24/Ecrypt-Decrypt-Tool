const AES = require("../features/aes.js");
const inquirer = require("inquirer");

async function main() {
    let answers;
    await inquirer
        .prompt([
            {
                name: "service",
                message: "Which Service do you want?",
                type: "list",
                choices: ["AES", "test2", "test3"],
            },
            {
                name: "aes-type",
                message: "Which AES Service do you want?",
                type: "list",
                choices: ["Decryption", "Encryption"],
                when: (answers) => answers.service === "AES",
            },
            {
                name: "aes-technique",
                message: "Which AES Service do you want?",
                type: "list",
                choices: [
                    "aes-128-cbc",
                    "aes-128-ecb",
                    "aes-192-cbc",
                    "aes-192-ecb",
                    "aes-256-cbc",
                    "aes-256-ecb",
                ],
                when: (answers) => answers["service"] === "AES",
            },
            {
                name: "input-path",
                message: "Enter the input file path",
                type: "input",
                when: (answers) => answers["service"] === "AES",
            },
            {
                name: "password",
                message: "Enter password for encryption/decryption",
                type: "password",
                when: (answers) => answers["service"] === "AES",
            },
        ])
        .then((givens) => {
            answers = givens;
        });

    console.log(answers);

    if (answers["service"] === "AES") {
        let aes = new AES(
            answers["aes-technique"],
            answers["password"],
            answers["input-path"],
        );
        if (answers["aes-type"] === "Encryption") {
            aes.encrypt((result) => {
                console.log(
                    result
                        ? "Your file has been encrypted"
                        : "The code has been exploded",
                );
            });
        } else {
            aes.decrypt((result) => {
                console.log(
                    result
                        ? "Your file has been decrypted"
                        : "The code has been exploded",
                );
            });
        }
    } else if (answers["service"] === "test2") {
    } else if (answers["service"] === "test3") {
    }
}

main();
