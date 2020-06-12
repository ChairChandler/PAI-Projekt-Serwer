"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
let keys;
function generateKeys(callback) {
    keys = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: ''
        }
    });
    callback();
}
exports.default = generateKeys;
function decrypt(val) {
    const buffer = Buffer.from(val, 'base64');
    const decrypted = crypto_1.default.privateDecrypt({
        key: keys.privateKey.toString(),
        passphrase: ''
    }, buffer);
    return decrypted.toString('utf8');
}
exports.decrypt = decrypt;
function getKeys() {
    return Object.assign({}, keys);
}
exports.getKeys = getKeys;
