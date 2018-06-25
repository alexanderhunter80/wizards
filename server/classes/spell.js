module.exports = class SpellCard {
    constructor(name, text, elements, effect, targeted) {
        this.name = name;
        this.text = text;  // text of spell effect
        this.elements = elements;  // is an array of elements, in one way or another
        this.effect = effect;  // event keyword to be dispatched when card is played
        this.targeted = targeted;  // boolean if we need to enter a targeting mode
    }

    // method(){}
}