import { NumericPassword } from "./NumericPassword.js";
import { LetterPassword } from "./LetterPassword.js";

export function generatePassord(length, passwordType) {
    const normalizedLength = Math.max(0, Math.floor(Number(length)) || 0);
    const useLetters = passwordType === "letters" || passwordType === "letter" || passwordType === true;
    const alphabet = useLetters
        ? "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        : "0123456789";
    let passwordText = "";

    for (let index = 0; index < normalizedLength; index++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        passwordText += alphabet[randomIndex];
    }

    return useLetters
        ? new LetterPassword(passwordText)
        : new NumericPassword(passwordText);
}

export function passwordStrength(password) {
    const length = String(password).length;

    if (length < 5) {
        return 0;
    }

    if (length <= 10) {
        return 1;
    }

    return 2;
}

// Допълнителен правилно изписан псевдоним за по-удобна употреба.
export const generatePassword = generatePassord;
