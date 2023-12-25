const { dialog } = require('electron');

function error(title, err) {
    dialog.showErrorBox(title, err);
}

function message(title, message) {
    dialog.showMessageBoxSync({
        title,
        message,
    });
}

module.exports = { error, message };