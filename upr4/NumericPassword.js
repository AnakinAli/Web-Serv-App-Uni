import { Digit } from "./Digit.js";

export class NumericPassword {
    constructor(password = "") {
        this.symbols = [];
        this.setPassword(password);
    }

    setPassword(password) {
        const text = String(password);

        if (!/^\d*$/.test(text)) {
            throw new Error("NumericPassword може да съдържа само цифри.");
        }

        this.symbols = Array.from(text).map(function (symbol) {
            return new Digit(symbol);
        });
    }

    print() {
        console.log(this.toString());
    }

    getType() {
        return "NumericPassword";
    }

    toString() {
        return this.symbols.map(function (digit) {
            return digit.toString();
        }).join("");
    }
}
