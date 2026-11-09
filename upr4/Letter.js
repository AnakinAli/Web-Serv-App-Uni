import { BaseSymbol } from "./BaseSymbol.js";

export class Letter extends BaseSymbol {
    constructor(symbol) {
        super(symbol);

        if (!/^[a-zA-Z]$/.test(this.symbol)) {
            throw new Error("Letter приема точно една латинска буква.");
        }
    }

    getType() {
        return "Letter";
    }
}
