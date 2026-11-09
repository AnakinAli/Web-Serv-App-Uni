import { Letter } from "./Letter.js";

export class LetterPassword {
    constructor(password = "") {
        this.symbols = [];
        this.setPassword(password);
    }

    setPassword(password) {
        const text = String(password);

        if (!/^[a-zA-Z]*$/.test(text)) {
            throw new Error("LetterPassword може да съдържа само латински букви.");
        }

        this.symbols = Array.from(text).map(function (symbol) {
            return new Letter(symbol);
        });
    }

    print() {
        console.log(this.toString());
    }

    getType() {
        return "LetterPassword";
    }

    toString() {
        return this.symbols.map(function (letter) {
            return letter.toString();
        }).join("");
    }
}
