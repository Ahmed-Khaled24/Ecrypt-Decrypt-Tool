const { join } = require("path");
const { readFileSync } = require("fs");
const {
    encrypt_sign,
    decrypt_verify,
} = require("../src/features/encrypt-sign_decrypt-verify");

describe("Encrypt and Sign, Decrypt and Verify", () => {
    let privateKey, publicKey, symmetricKey;
    beforeAll(() => {
        privateKey = readFileSync(
            join(__dirname, "../default-keys/private.pem"),
            "utf-8",
        );
        publicKey = readFileSync(
            join(__dirname, "../default-keys/public.pem"),
            "utf-8",
        );
        symmetricKey = "I am very strong key";
    });

    test("Encrypt and Sign", async () => {
        const result = await encrypt_sign(
            privateKey,
            symmetricKey,
            join(__dirname, "../data/test2.txt"),
            join(__dirname, "../data/test2.enc.txt"),
        );
        expect(result).toBe(true);
    });

    test("Decrypt and verify", async () => {
        const result = await decrypt_verify(
            publicKey,
            symmetricKey,
            join(__dirname, "../data/test2.enc.txt"),
            join(__dirname, "../data/test2.dec.txt"),
        );
        expect(result).toBe(true);
    });
});
