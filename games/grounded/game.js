const startData = { title: 'Grounded', room: 'room', frame: 'A1', extension: 'jpeg', 
    customCursors: true, frameWidth: 640, frameHeight: 480 } 


/* radio songs - 
    In Every Heart
    Martha My Dear
    ABC
    Circlesong Six (?)
*/

const roomData = {
    'room': {
        'A1': { left: 'A11', right: 'A2', boxes: [{ xy: [.6, .67, .35, .51], to: 'A1a' }] },
        'A1a': { back: 'A1' },
        'A2': { left: 'A1', right: 'A3', boxes: [ { xy: [.57, .8, .5, .83], to: 'A2a' }]},
        'A2a': { back: 'A2', boxes: [{ xy: [.28, .34, .89, .97], to: 'A2b' }] },
        'A2b': { back: 'A2', boxes: [{ xy: [.28, .34, .89, .97], to: 'A2a' }, { xy: [.6, .8, .4, .75], to: 'A2c' }] },
        'A2c': { back: 'A2b', boxes: [
            { xy: [.32, .37, .53, .61], fn: () => { if (comboMatches([1, 9, 8, 3])) { goTo('A2d') }} },
            { xy: [.41, .46, .53, .63], fn: () => { buttonPush([0, 1]); refresh() }}, 
            { xy: [.46, .51, .53, .63], fn: () => { buttonPush([0, 1, 2]); refresh() }}, 
            { xy: [.51, .56, .53, .63], fn: () => { buttonPush([1, 2, 3]); refresh() }}, 
            { xy: [.56, .61, .53, .63], fn: () => { buttonPush([2, 3]); refresh() }},
            { pic: () => { return 'combo/' + s.combo[0] + '.png' }, offset: [.41, .63], style: 'width: 30px' },
            { pic: () => { return 'combo/' + s.combo[1] + '.png' }, offset: [.46, .63], style: 'width: 30px' },
            { pic: () => { return 'combo/' + s.combo[2] + '.png' }, offset: [.51, .63], style: 'width: 30px' },
            { pic: () => { return 'combo/' + s.combo[3] + '.png' }, offset: [.56, .63], style: 'width: 30px' }
        ]},
        'A2d': { back: 'A2b', forward: 'A2f' },
        'A2e': { back: 'A2b' },
        'A2f': {  back: 'A2b', forward: 'A2e' },
        'A3': { left: 'A2', right: 'A4', boxes: [{ xy: [.3, .5, .5, .83], to: 'A3a' }]},
        'A3a': { back: 'A3' },
        'A4': { left: 'A3', right: 'A5' },
        'A5': { left: 'A4', right: 'A6', boxes: [{ xy: [.38, .9, .3, .6], to: 'A5a' }]},
        'A5a': { forward: 'A5b', back: 'A5' },
        'A5b': { forward: 'A5a', back: 'A5' },
        'A6': { left: 'A5', right: 'A7', boxes: [{ xy: [.5, .8, .37, .74], to: 'A6a'}]},
        'A6a': { back: 'A6' },
        'A7': { left: 'A6', right: 'A8', forward: 'A7a' },
        'A7a': { back: 'A7' },
        'A8': { left: 'A7', right: 'A9', boxes: [{ xy: [.52,.61,.4,.55], to: 'A8a' }]},
        'A8a': { back: 'A8', boxes: [{ xy: [.4, .6, .3, .65], fn: ()=> { goTo('A8b', 'none'); wait(.02, ()=> { goTo('A8a', 'none')})}}] },
        'A9': { left: 'A8', right: 'A10', boxes: [{ xy: [.25, .45, .6, .8], to: 'A9a' }] },
        'A9a': { back: 'A9' },

        'A10': { left: 'A9', right: 'A11', forward: 'B1' },
        'A11': { left: 'A10', right: 'A1', boxes: [{ xy: [.4, .55, .4, .6], to: () => { return s.lightOn ? 'A11b' : 'A11a' }}] },
        'A11a': { back: 'A11', boxes: [{ xy: [.35, .54, .33, .7], fn: () => { s.lightOn = true; goTo('A11b') }}] },
        'A11b': { back: 'A11', boxes: [{ xy: [.35, .54, .33, .7], fn: () => { s.lightOn = false; goTo('A11a') } }] },
        'B1': { left: 'B2', right: 'B2', back: 'A10', boxes: [{ xy: [.61, .68, .45, .62], fn: ()=> { goTo(s.lightOn ? 'B1c' : 'B1b') }}] },
        'B1a': { left: 'B2', right: 'B2', forward: () => { s.lightOn ? 'B1b' : 'B1c' }},
        'B1b': { left: 'B2', right: 'B2', forward: 'C1' },
        'B1c': { left: 'B2', right: 'B2', forward: 'D1' },
        'B2': { forward: 'A5', left: 'B1', right: 'B1' },
        'C1': { left: 'C4', right: 'C2' },
        'C2': { left: 'C1', right: 'C3' },
        'C3': { left: 'C2', right: 'C4', forward: 'B2' },
        'C4': { left: 'C3', right: 'C1' },
        'D1': { left: 'D4', right: 'D2' },
        'D2': { left: 'D1', right: 'D3' },
        'D3': { left: 'D2', right: 'D4', forward: 'B2' },
        'D4': { left: 'D3', right: 'D1', boxes: [{ xy: [.2, .63, 0, .5], to: 'D4a' }] },
        'D4a': { back: 'D4' }
    }
}

const s = { 
    lightOn: false,
    combo: [0, 0, 0, 0]
}

function buttonPush(vals) {
    for (i in vals) {
        s.combo[vals[i]] = (s.combo[vals[i]] + 1) % 10
    }
}

function comboMatches(goal) {
    for (i in goal) {
        if (s.combo[i] != goal[i]) {
            return false
        }
    }
    return true
}