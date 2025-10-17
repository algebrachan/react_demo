import CryptoJS from 'crypto-js';


const SECRET_KEY = "guanguan"
const VI = "guanguan"

export const encryptDes = (data) => {
    // 使用DES加密
    let key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    let iv = CryptoJS.enc.Utf8.parse(VI);
    let encrypted = CryptoJS.DES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}