const AES = require("../src/features/aes");
const path = require("path");

describe("test key length", () => {
    test("Test #1", () => {
        const p = new AES("aes-128-ecb", "", "", "");
        expect(p.keyLength).toBe(16);
    });
    test("Test #2", () => {
        const p = new AES("aes-256-ecb", "", "", "");
        expect(p.keyLength).toBe(32);
    });
});

describe("test validateAlgorithm", () => {
    test("Test #1", () => {
        const p = new AES("aes-128-ecb", "", "", "");
        expect(p.validateAlgorithm()).toBe(true);
    });
    test("Test #2", () => {
        const p = new AES("aes-256-ecb", "", "", "");
        expect(p.validateAlgorithm()).toBe(true);
    });
    test("Test #3", () => {
        const p = new AES("ase-128-ecb", "", "", "");
        expect(p.validateAlgorithm()).toBe(false);
    });
    test("Test #4", () => {
        const p = new AES("aes-128-ecbd", "", "", "");
        expect(p.validateAlgorithm()).toBe(false);
    });
});
describe("test encryption function", () => {
    test("Test #1", (done) => {
        const p = new AES(
            "aes-256-ecb",
            "ahmed elsayed",
            path.join(__dirname, "../data/test.txt"),
            path.join(__dirname, "../data/"),
        );
        expect(
            p.encrypt((result) => {
                expect(result).toBe(true);
                done();
            }),
        );
    });
});

describe("test decryption function", () => {
    test("Test #1", (done) => {
        const p = new AES(
            "aes-256-ecb",
            "ahmed elsayed",
            path.join(__dirname, "../data/test.txt.enc"),
            path.join(__dirname, "../data/"),
        );
        expect(
            p.decrypt((result) => {
                expect(result).toBe(true);
                done();
            }),
        );
    });
});
