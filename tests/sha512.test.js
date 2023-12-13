const { generateHash } = require("../src/features/sha512.js");

describe("SHA512 Hashing", () => {
    test("should generate a hash", () => {
        const data = "Hello World!";
        const hash = generateHash(data);
        expect(hash).toBeDefined();
    });
});
