const { createHash } = require("node:crypto");

function generateHash(data) {
    const hash = createHash("sha512");
    hash.update(data);
    return hash.digest("hex");
}

module.exports = { generateHash };
