module.exports = class Player {
    constructor(id, socketid, name) {
        this.id = id;
        this.socketid = socketid;
        this.name = name;
        this.spells = [];
        this.health = 5;
        this.shields = 0;
        this.aptokens = 0;
        this.hptokens = 0;
        this.isGhost = false;
        this.passives = [];
    }

    // method(params) {}

    draw(deck){
        this.spells.push(deck.topCard()); // untested
    }

    discard(card, deck){
        let idx = this.spells.indexOf(card);
        if (idx !== -1) { array.splice(idx, 1) }; // untested
        deck.discard.push(card);
    }

}