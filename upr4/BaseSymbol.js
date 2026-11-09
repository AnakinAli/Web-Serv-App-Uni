export class BaseSymbol {
    constructor(symbol) {
        this.symbol = String(symbol);
    }

    toUpper() {
        this.symbol = this.symbol.toUpperCase();
        return this.symbol;
    }

    toLower() {
        this.symbol = this.symbol.toLowerCase();
        return this.symbol;
    }

    print() {
        console.log(this.symbol);
    }

    getType() {
        return "BaseSymbol";
    }

    toString() {
        return this.symbol;
    }
}
