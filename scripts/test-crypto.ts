
import { encrypt, decrypt } from "../src/lib/crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const testString = "TestPassword123!";

try {
    console.log("Testing Crypto Utility...");
    if (!process.env.ENCRYPTION_KEY) {
        throw new Error("ENCRYPTION_KEY missing in environments");
    }

    const encrypted = encrypt(testString);
    console.log("Encrypted:", encrypted);

    const decrypted = decrypt(encrypted);
    console.log("Decrypted:", decrypted);

    if (decrypted === testString) {
        console.log("SUCCESS: Decrypted string matches original.");
    } else {
        console.error("FAILURE: Decrypted string does not match.");
        process.exit(1);
    }
} catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
}
