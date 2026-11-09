import { BaseSymbol } from "./BaseSymbol.js";

export class Digit extends BaseSymbol {
    constructor(symbol) {
        super(symbol);

        if (!/^\d$/.test(this.symbol)) {
            throw new Error("Digit приема точно една цифра.");
        }
    }

    getType() {
        return "Digit";
    }
}
