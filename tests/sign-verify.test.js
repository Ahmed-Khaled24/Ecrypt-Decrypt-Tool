const { generateKeyPairSync } = require("crypto");
const { sign, verify } = require("../src/features/sign-verify.js");

describe("Sign and Verify", () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });
    test("Sign a message", () => {
        const data = "Hello World!";
        const signature = sign(data, privateKey);
        expect(signature).toBeDefined();
    });
    test("Verify a message", () => {
        const data = "Hello World!";
        const signature = sign(data, privateKey);
        const isVerified = verify(data, publicKey, signature);
        expect(isVerified).toBe(true);
    });
});
