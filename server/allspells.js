const actions = require('./redux/actions');

// card template
// { name: '', text: '', elements: '', effects: [{type: actions.XXX, args}], targeted: XXX, copies: N },

module.exports = [
    { name: 'Quickness', text: 'AP +2', elements: 'AA', effects: [{type: actions.AP_PLUS, value: 2}], targeted: false, copies: 4 },
    { name: 'Stoneskin', text: 'Shield 1', elements: 'EE', effects: [{type: actions.CURE, value: 1}], targeted: false, copies: 4 },
    { name: 'Fireball', text: 'Attack 1', elements: 'FF', effects: [{type: actions.ATTACK, value: 1}], targeted: true, copies: 4 },
    { name: 'Potion', text: 'Cure 1', elements: 'WW', effects: [{type: actions.CURE, value: 1}], targeted: false, copies: 4 },

    { name: 'Gust of Wind', text: 'Target AP -1', elements: 'AE', effects: [{type: actions.AP_MINUS, value: 1}], targeted: true, copies: 3 },
    { name: 'Arc', text: 'Attack 1, Chain once', elements: 'AF', effects: [{type: actions.ATTACK, value: 1}, {type: actions.ATTACK, value: 1}], targeted: true, copies: 3 },
    { name: 'Smoke Bomb', text: 'Obscure 2', elements: 'AW', effects: [{type: actions.OBSCURE, value: 2}], targeted: true, copies: 3 },
    { name: 'Magma Ball', text: 'Burn 2', elements: 'EF', effects: [{type: actions.HP_MINUS, value: 2}], targeted: true, copies: 3 },
    { name: 'Placebo', text: 'Regen 1', elements: 'EW', effects: [{type: actions.HP_PLUS, value: 1}], targeted: false, copies: 3 },
    { name: 'Energy Drain', text: 'Attack 1, Cure = damage dealt', elements: 'FW', effects: [{type: actions.ATTACK, value: 1} /*, {type: actions.DRAIN, value: 1} */], targeted: true, copies: 3 },
]