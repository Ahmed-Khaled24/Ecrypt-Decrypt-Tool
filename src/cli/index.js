import inquirer from "inquirer";

inquirer
    .prompt([
        {
            name: "greeting",
            message: "are you here?",
            type: "input",
        },
        {
            name: "test",
            message: "what's your name?",
            type: "list",
            choices: ["black", "red", "blue", "yellow", "green", "whitesmoke"],
        },
    ])
    .then((answers) => {
        console.log(answers);
        console.log(answers.test);
    });
