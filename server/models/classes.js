// require





class ElementCard {
    constructor(elem){
        this.elem = elem;
        this.imagepath = null; // may not need this
        this.faceUp = false;
    }

    // method(){}
}





class SpellCard {
    constructor(name, text, elements, effect) {
        this.name = name;
        this.text = text;  // text of spell effect
        this.elements = elements;  // is an array of elements, in one way or another
        this.effect = effect;  // event to be dispatched when card is played
    }

    // method(){}
}





class Deck {
    constructor() {
        this.cards = [];
        this.discard = [];
    }

    initializeAsElementDeck(){
        // create and push 11 copies of each standard element plus 8 copies of 'aether', then shuffle
        console.log('setting up element deck');
        for(let i = 0; i < 11; i++){
            this.cards.push(new ElementCard('air'));
            this.cards.push(new ElementCard('earth'));
            this.cards.push(new ElementCard('fire'));
            this.cards.push(new ElementCard('water'));
        }
        for(let i = 0; i < 8; i++){
            this.cards.push(new ElementCard('aether'));
        };
        this.shuffle([]);
        console.log('finished initializing');
    };

    initializeAsSpellDeck(){
        // a bunch of mongodb queries here
        // access all spell cards in db, create (copies_per_deck) copies of each card 
    };

    topCard(){
        return this.cards.pop();
    };

    push(card){
        this.cards.push(card);
    }

    shuffle(){ 
        // pass in cards from discard
        while(this.discard[0] != null){
            this.push(this.discard.pop());
        };

        // shuffle everything together
        let m = this.cards.length, t, i;
        while (m) {
          i = Math.floor(Math.random() * m--);
          t = this.cards[m];
          this.cards[m] = this.cards[i];
          this.cards[i] = t;
        }
    };

    // detect empty this.cards and shuffle()

}





class Player {
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





class Gameboard {
    constructor(elementDeck) {
        this.deck = elementDeck;
        this.grid = [[],[],[],[]];
        // spell cards
        
        for(let y = 0; y < 4; y++){ // rows in grid
            for(let x = 0; x < 4; x++){ // columns in grid
                let drawnCard = this.deck.topCard();
                console.log(drawnCard);
                if ((y == 1 || y == 2) && (x == 1 || x == 2)){ // if one of the four central grid positions, make card faceup by default
                    drawnCard.faceUp = true;
                }
                this.grid[y].push(drawnCard);
            }
        }
    }

    // shuffle discards back into element deck
    shuffleElements() { 
        this.deck.shuffle();
    }

    // shuffle spells back into spell deck

    // weave - swap the positions of two cards
    weave(y1,x1,y2,x2) {
        console.log('Weaving '+this.grid[y1][x1].elem+' at '+y1+', '+x1+' and '+this.grid[y2][x2].elem+' at '+y2+', '+x2+'...');
            // Weaving ELEMENT at y1, x1 and ELEMENT at y2, x2
        let temp = this.grid[y1][x1];
        this.grid[y1][x1] = this.grid[y2][x2];
        this.grid[y2][x2] = temp;
        console.log('*'.repeat(63));
        console.log('*'.repeat(25)+' AFTER WEAVING '+'*'.repeat('25'));
        this.printState();
    }

    // obscure - turn one card face down
    obscure(y,x) {
        console.log('Obscuring '+this.grid[y][x].elem+' at '+y+', '+x+'...');
        this.grid[y][x].faceUp = false;
        console.log('*'.repeat(63));
        console.log('*'.repeat(25)+' AFTER OBSCURING '+'*'.repeat('25'));
        this.printState();
    }

    // scry - turn one card face up
    scry(y,x) {
        console.log('Scrying '+this.grid[y][x].elem+' at '+y+', '+x+'...');
        this.grid[y][x].faceUp = true;
        console.log('*'.repeat(63));
        console.log('*'.repeat(25)+' AFTER SCRYING '+'*'.repeat('25'));
        this.printState();
    }

    // replace - send one card to discard and replace with one from deck
    replace(y, x){
        console.log('Replacing '+this.grid[y][x].elem+' at '+y+', '+x+'...');
        this.deck.discard.push(this.grid[y][x]);
        this.grid[y][x] = this.deck.topCard();
        if ((y == 1 || y == 2) && (x == 1 || x == 2)){
            this.grid[y][x].faceUp = true;
        }
        console.log('*'.repeat(63));
        console.log('*'.repeat(25)+' AFTER REPLACING '+'*'.repeat('25'));
        console.log('*'.repeat(63));
        console.log('Cards in deck:'+this.deck.cards.length+' || Cards in discard: '+this.deck.discard.length);
        this.printState();
    }

    // print state of game to terminal in formatted ASCII
    // currently only prints element grid; ALLCAPS = face up
    printState(){
        let white = '            ';
        let printFormat = function(card) {
            let pstr = card.elem+white.slice(0,12-card.elem.length);
            if (card.faceUp == true){
                pstr = pstr.toUpperCase();
            }
            return pstr;
        }

        console.log('*'.repeat(61));
        console.log('');
        console.log('xxxx       '+printFormat(this.grid[0][0])+printFormat(this.grid[0][1])+printFormat(this.grid[0][2])+printFormat(this.grid[0][3])+'xxxx');
        console.log('');
        console.log('xxxx       '+printFormat(this.grid[1][0])+printFormat(this.grid[1][1])+printFormat(this.grid[1][2])+printFormat(this.grid[1][3])+'xxxx');
        console.log('');
        console.log('xxxx       '+printFormat(this.grid[2][0])+printFormat(this.grid[2][1])+printFormat(this.grid[2][2])+printFormat(this.grid[2][3])+'xxxx');
        console.log('');
        console.log('xxxx       '+printFormat(this.grid[3][0])+printFormat(this.grid[3][1])+printFormat(this.grid[3][2])+printFormat(this.grid[3][3])+'xxxx');
        console.log('');
        console.log('*'.repeat(61));
        console.log(this.grid);
    }


}



module.exports = {
    ElementCard,
    SpellCard,
    Deck,
    Player,
    Gameboard
}