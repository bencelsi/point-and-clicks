/*
TODOs:

NICE TO HAVE
Small clockhands
Add 'click to start'
blurry lightswitch3 image
no cursor on inventory div if empty
variable cuckoos
*/

const config = {
    title: 'Grounded',
    width: 640, height: 480,
    room: 'room', frame: 'A0',
    extension: 'jpeg',
    customCursors: true,
    boxCursor: 'O',
    defaultCursor: 'N',
    waitCursor: null,
    defaultBox: { cursor: 'O' },
    style: '',
    commonBoxes: {
		forward: { xy: [.2, .8, 0, 1], transition: 'fade', cursor: 'F' },
		left: { xy: [0, .2, 0, 1], transition: 'none', cursor: 'L' },
		right: { xy: [.8, 1, 0, 1], transition: 'none', cursor: 'R' },
		back: { xy: [0, 1, 0, .2], transition: 'fade', cursor: 'B' }},
    boxOffset: [-.03, .02]
}

const songs = 
    ['abc.wav', 'dentist.wav', 'fire.wav', 'glidd.wav', 'obama.wav', 'hilary.wav', 'martha.wav', 'radio.wav', 'rock.wav', 'train.wav']

const roomData = {
    'room': {
        'A0': { boxes: [{ xy: [0, 1, 0, 1], cursor: 'N', fn: () => { setFade(3); setMusic(songs[s.radio], false); setMusicVolume(.7); 
            goTo('A1'); wait(3, () => { setFade(1) })}}]},
        'A1': { left: 'A11', right: 'A2', boxes: [{ xy: [.6, .67, .35, .51], cursor: 'Z', to: 'A1a' },
            { xy: [0, .1, .4, .55], cursor: 'Z', to: () => { return s.lightOn ? 'A11b' : 'A11a' }},
            { xy: [.85,1, .5,.85], cursor: 'Z', to: 'A2a'}, { pic: 'lightswitch1', if: () => { return s.lightOn } }]},
        'A1a': { back: 'A1' },
        'A2': { left: 'A1', right: 'A3', boxes: [{ xy: [.57, .8, .5, .83], cursor: 'Z', to: 'A2a' }, 
            { xy: [.34, .4, .36, .5], cursor: 'Z', to: 'A1a'}]},
        'A2a': { back: 'A2', boxes: [{ xy: [.28, .34, .89, .97], cursor: 'F', to: 'A2b', fn: () => { playSound('creak') }}] },
        'A2b': { back: 'A2', boxes: [{ xy: [.28, .34, .89, .97], cursor: 'F', to: 'A2a', fn: () => { playSound('creak') }}, 
            { xy: [.57, .85, .4, .77], to: 'A2c', cursor: 'Z' },
            { pic: () => { return 'numbers/' + s.combo[0] + '.jpg' }, offset: [.685, .64], style: 'width: 10px' },
            { pic: () => { return 'numbers/' + s.combo[1] + '.jpg' }, offset: [.705, .64], style: 'width: 10px' },
            { pic: () => { return 'numbers/' + s.combo[2] + '.jpg' }, offset: [.725, .64], style: 'width: 10px' },
            { pic: () => { return 'numbers/' + s.combo[3] + '.jpg' }, offset: [.745, .64], style: 'width: 10px' }]},
        'A2c': { back: 'A2b', boxes: [
            { xy: [.3, .4, .5, .65], cursor: 'O', fn: () => {
                if (comboMatches([1, 9, 8, 3])) { freeze(); playSound('safe'); 
                    for (i in [1, 2, 3, 4]) wait(1 + i * .5, () => { playSound('click')})
                    wait(3, () => { goTo( s.pig == 1 ? 'A2d' : 'A2e'); unfreeze() })}}},
            { xy: [.41, .46, .53, .63], cursor: 'O', fn: () => { comboPush([0, 1]); refresh() }}, 
            { xy: [.46, .51, .53, .63], cursor: 'O', fn: () => { comboPush([0, 1, 2]); refresh() }}, 
            { xy: [.51, .56, .53, .63], cursor: 'O', fn: () => { comboPush([1, 2, 3]); refresh() }}, 
            { xy: [.56, .61, .53, .63], cursor: 'O', fn: () => { comboPush([2, 3]); refresh() }},
            { pic: () => { return 'numbers/' + s.combo[0] + '.jpg' }, offset: [.4, .62], style: 'width: 30px' },
            { pic: () => { return 'numbers/' + s.combo[1] + '.jpg' }, offset: [.45, .62], style: 'width: 30px' },
            { pic: () => { return 'numbers/' + s.combo[2] + '.jpg' }, offset: [.5, .62], style: 'width: 30px' },
            { pic: () => { return 'numbers/' + s.combo[3] + '.jpg' }, offset: [.55, .62], style: 'width: 30px' }
        ]},
        'A2d': { back: 'A2b', boxes: [
            { xy: [.4, .55, .3, .7], cursor: () => { return s.pigZoom ? 'O' : 'Z' },
                fn: () => { if (s.pigZoom) { s.pig = 0; goTo('A2e'); refreshInventory() } else { goTo('A2f'); s.pigZoom = true }}},
            { xy: [.2, .3, .45, .7], to: 'A2c' }]},
        'A2e': { back: 'A2b', boxes: [{ xy: [.4, .55, .3, .7], id: 'safe', cursor: 'N' }, { xy: [.2, .3, .45, .7], to: 'A2c' }]},
        'A2f': { back: 'A2d', boxes: [{ xy: [.5, .83, .12, .8], cursor: 'O', fn: () => { goTo('A2e'); s.pig = 0; refreshInventory() }}]},
        'A3': { left: 'A2', right: 'A4', boxes: [{ xy: [0, .25, .5, .85], to: 'A2a', cursor: 'Z' },
            { xy: [.3, .5, .5, .83], cursor: 'Z', to: 'A3a' }]},
        'A3a': { back: 'A3', boxes: [{ pic: () => { return s.clockOn ? 'on' : 'off' }, offset: [.65,.2], style: 'width: 20px' },
            { xy: [.63,.7,.1,.25], cursor: 'O', fn: () => { s.clockOn = !s.clockOn; stopSound('cuckoo'); if (!s.clockRunning) runClock(); refresh() }},
            { pic: 'clockHour', offset: [.49, .5], style: () => { 
                return 'transform: rotate(' + s.time / 120 + 'deg); transform-origin: center bottom; height: 50px' }},
            { pic: 'clockMinute', offset: [.49, .54], style: () => { 
                return 'transform: rotate(' + s.time / 10 + 'deg); transform-origin: center bottom; height: 70px' }},
            { pic: 'clockSecond', offset: [.5, .52], style: () => { 
                return 'transform: rotate(' + s.time * 6 + 'deg); transform-origin: center bottom; height: 60px' }}]},
        'A3b': { back: { to: 'A3', fn: () => { playSound('close'); stopSound('cuckoo') }}, boxes: [{ pic: () => { return s.clockOn ? 'on' : 'off' }, offset: [.65,.2], style: 'width: 20px' },
            { xy: [.63,.7,.1,.25], cursor: 'O', fn: () => { s.clockOn = !s.clockOn; stopSound('cuckoo'); if (s.clockOn) { playSound('close'); goTo('A3a'); runClock() }; refresh() }},
            { xy: [.4,.7,.6,.85], cursor: 'Z', to: () => { return s.key == 1 ? 'A3c' : 'A3d' }, if: () => { return !s.clockOn }},
            { pic: 'clockHour', offset: [.49, .5], style: () => { 
                return 'transform: rotate(' + s.time / 120 + 'deg); transform-origin: center bottom; height: 50px' }},
            { pic: 'clockMinute', offset: [.49, .54], style: () => { 
                return 'transform: rotate(' + s.time / 10 + 'deg); transform-origin: center bottom; height: 70px' }},
            { pic: 'clockSecond', offset: [.5, .52], style: () => { 
                return 'transform: rotate(' + s.time * 6 + 'deg); transform-origin: center bottom; height: 60px' }}]},
        'A3c': { back: 'A3b', boxes: [{ xy: [.3, .9, .4, .7], fn: () => { s.key = 0; goTo('A3d'); refreshInventory() }}]},
        'A3d': { back: 'A3b', boxes: [{ xy: [.3, .9, .4, .7], cursor: 'N', id: 'clock' }]},
        'A4': { left: 'A3', right: 'A5' },
        'A5': { left: 'A4', right: 'A6', boxes: [{ xy: [.41, .89, .3, .6], cursor: 'Z', to: 'A5a' }]},
        'A5a': { back: 'A5', boxes: [{ xy: [.45, .59, .37, .53], cursor: 'O', to: 'A5b', fn: () => { playSound('open') }}]},
        'A5b': { forward: { to: 'A5a', fn: () => { playSound('close') }}, back: { to: 'A5', fn: () => { playSound('close') }}},
        'A6': { left: 'A5', right: 'A7', boxes: [{ xy: [.5, .8, .37, .74], cursor: 'Z', to: 'A6a'}]},
        'A6a': { back: 'A6' },
        'A6c': { forward: 'E2'},
        'A7': { left: 'A6', right: 'A8', forward: { cursor: 'Z', to: 'A7a' }},
        'A7a': { back: 'A7' },
        'A8': { left: 'A7', right: 'A9', boxes: [{ xy: [.52, .61, .4, .55], cursor: 'Z', to: 'A8a' },
            {xy: [.2,.45,.1,.35], cursor: 'Z', to: 'A8c'}]},
        'A8a': { back: 'A8', boxes: [{ xy: [.4, .6, .3, .65], fn: ()=> { goTo('A8b', 'none'); wait(.04, ()=> { goTo('A8a', 'none')})}}] },
        'A8c': { back: 'A8' },
        'A9': { left: 'A8', right: 'A10', boxes: [{ xy: [.25, .45, .6, .8], cursor: 'Z', to: 'A9a', fn: () => { setMusicVolume(1) } }] },
        'A9a': { back: { to: 'A9', fn: () => { setMusicVolume(.7) }}, boxes: [
            { xy: [.61, .7, .31, .4], fn: () => { s.radioOn = !s.radioOn; refresh(); setMusic(s.radioOn ? songs[s.radio] : null, false) }},
            { xy: [.47, .55, .33, .4], fn: () => { s.radio = (s.radio + 1) % 10; playSound('click'); setMusic(songs[s.radio], false); refreshBoxes() }},
            { pic: () => { return s.radioOn ? 'on' : 'off' }, offset: [.64, .4], style: 'width: 30px' },
            { pic: () => { return 'numbers/' + ((s.radio + 1) % 10) + '.jpg' }, offset: [.5, .4], style: 'height: 30px' },
            { pic: 'dial', offset: () => { return [.49 + (s.radio * .02), .52]}, style: 'height: 30px' }]},
        'A10': { left: 'A9', right: 'A11', forward: { to: 'B1', fn: () => { c.commonBoxes.left.transition = 'left'; c.commonBoxes.right.transition = 'right' }}},
        'A11': { left: 'A10', right: 'A1', boxes: [
            { xy: [.4, .55, .4, .6], cursor: 'Z', to: () => { return s.lightOn ? 'A11b' : 'A11a' }},
            { pic: 'lightswitch2', if: () => { return s.lightOn } }] },
        'A11a': { back: 'A11', boxes: [{ xy: [.35, .54, .33, .7], cursor: 'O', fn: () => { s.lightOn = true; goTo('A11b') }}]},
        'A11b': { back: 'A11', boxes: [{ xy: [.35, .54, .33, .7], cursor: 'O', fn: () => { s.lightOn = false; goTo('A11a') }}]},
        'B1': { left: { transition: 'left', to: 'B2' }, right: 'B2', back: 'A10',
            boxes: [{ xy: [.6, .75, .4, .65], id: 'doorknob', cursor: () => { return s.key == 2 ? 'O' : 'F' },
            fn: ()=> { if (s.key == 2) { goTo(s.lightOn ? 'B1b' : 'B1a') }}}, { pic: 'key', if: () => { return s.key == 2 }}] },
        'B1a': { left: 'B2', right: 'B2', forward: { to: 'C1', fn: () => { setMusicVolume(.3) }}, boxes: [{ xy: [.38, .41, .48, .59], to: 'B1' }] },
        'B1b': { left: 'B2', right: 'B2', forward: { to: 'D1', fn: () => { setMusicVolume(.3) }}, boxes: [{ xy: [.38, .41, .48, .59], to: 'B1' }] },
        'B2': { forward: { to: 'A5', fn: () => { c.commonBoxes.left.transition = c.commonBoxes.right.transition = 'none' }}, 
            left: 'B1', right: 'B1', boxes: [{ xy: [.65, .8, .8, 1], to: 'B2a', cursor: 'Z' }] },
        'B2a': { back: 'B2'},
        'C1': { left: 'C4', right: 'C2' },
        'C2': { left: 'C1', right: 'C3' },
        'C3': { left: 'C2', right: 'C4', forward: { to: 'B2', fn: () => { setMusicVolume(.7) }}},
        'C4': { left: 'C3', right: 'C1' },
        'D1': { left: 'D4', right: 'D2' },
        'D2': { left: 'D1', right: 'D3' },
        'D3': { left: 'D2', right: 'D4', forward: { to: 'B2', fn: () => { setMusicVolume(.7) }}},
        'D4': { left: 'D3', right: 'D1', boxes: [{ xy: [.2, .63, 0, .5], to: 'D4a', cursor: 'Z' }] },
        'D4a': { back: 'D4' },
        'E1': { forward: 'E2' },
        'E2': { onEnter: () => { setFade(5); setMusic(null); hideInventory(); doInSequence([2,
            () => { goTo('E3') }, 5,
            () => { goTo('E4') }, 7, 
            () => { goTo('E3') }
        ])}}
    }
}

/////// THREADS
function runClock() {
    if (!s.clockOn) { s.clockRunning = false; return }
    s.clockRunning = true; s.time += 1;
    let tickVolume = .3
    if (frame == 'A3a' || frame == 'A3b') { refreshBoxes(); tickVolume = 1 }
    if (frame.startsWith('A') || frame.startsWith('B')) playSound('tick', tickVolume)
    if (s.time % 60 == 0 && frame == 'A3a') {
        playSound('cuckoo'); goTo('A3b')
        wait(7, () => { if (frame == 'A3b' && s.clockOn) { playSound('close'); goTo('A3a') }})
    }
    wait(1, runClock)
}

const s = { 
    radio: 0, radioOn: true, clockOn: false, clockRunning: false, time: 3, lightOn: false, combo: [0, 0, 0, 0],
    pig: 1, key: 1, pigZoom: false
}

const inventory = {
    key: { img: 'key', targets: [{ id: 'doorknob', fn: () => { s.key = 2; refresh() }}, 
        { id: 'clock', fn: () => { s.key = 1; goTo('A3c'); refreshInventory() }}]},
    pig: { img: 'pig', targets: [{ id: 'safe', fn: () => { s.pig = 1; goTo('A2d'); refresh() }},
        { frame: 'A6a', fn: () => { playSound('smash'); s.pig = 2; refreshInventory(); goTo('A6b'); wait(.25, ()=> { goTo('A6c') })}}]},
}

function comboPush(vals) {
    playSound('combo')
    for (i in vals) s.combo[vals[i]] = (s.combo[vals[i]] + 1) % 10
}

function comboMatches(goal) {
    for (i in goal) if (s.combo[i] != goal[i]) return false
    return true
}