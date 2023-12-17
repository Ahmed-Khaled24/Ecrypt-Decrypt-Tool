const { join } = require("path");
const { readFileSync } = require("fs");
const {
    encrypt_sign,
    decrypt_verify,
} = require("../src/features/encrypt-sign_decrypt-verify");

describe("Encrypt and Sign, Decrypt and Verify", () => {
    let privateKeyPath, publicKeyPath, symmetricKey;
    beforeAll(() => {
        privateKeyPath = join(__dirname, "../default-keys/private.pem");
        publicKeyPath = join(__dirname, "../default-keys/public.pem");
        symmetricKey = "I am very strong key";
    });

    test("Encrypt and Sign", async () => {
        const result = await encrypt_sign(
            privateKeyPath,
            symmetricKey,
            join(__dirname, "../data/test2.txt"),
        );
        expect(result).toBe(true);
    });

    test("Decrypt and verify", async () => {
        const result = await decrypt_verify(
            publicKeyPath,
            symmetricKey,
            join(__dirname, "../data/test2.enc.txt"),
        );
        expect(result).toBe(true);
    });
});
