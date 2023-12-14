const { createHash } = require("node:crypto");

/**
 * @param {string} data the data to generate hash for.
 * @returns
 */
function generateHash(data) {
    const hash = createHash("sha512");
    hash.update(data);
    return hash.digest("hex");
}

module.exports = { generateHash };
