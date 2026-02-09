import crypto from 'crypto';

const ALGORITHM = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 chars
const IV_LENGTH = 16; // AES block size

export function encrypt(text: string) {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
        throw new Error('Invalid ENCRYPTION_KEY: Must be 32 characters');
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

export function decrypt(hash: { iv: string, content: string }) {
    if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
        throw new Error('Invalid ENCRYPTION_KEY: Must be 32 characters');
    }

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY),
        Buffer.from(hash.iv, 'hex')
    );

    let decrypted = decipher.update(Buffer.from(hash.content, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}
