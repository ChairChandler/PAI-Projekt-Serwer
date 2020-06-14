import crypto from 'crypto'

let keys: { privateKey: string, publicKey: string }

export default async function generateKeys() {
    keys = crypto.generateKeyPairSync('rsa', {
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
    })
}

export function decrypt(val: string) {
    const buffer = Buffer.from(val, 'base64')
    const decrypted = crypto.privateDecrypt({
        key: keys.privateKey.toString(),
        passphrase: ''
    }, buffer)

    return decrypted.toString('utf8')
}

export function getKeys() {
    return { ...keys }
}
