// TODOS:
// Add Brochure
// Salad puzzle
// Clock puzzle
// Fireplace speaker
// Mr Bobb animations
// Cursor Alignment
// Make it possible to drag small key without zooming in, just show zoom shot for a moment
// ‘No Water’ text
// Clockroom Puzzle
// live update for heater level
// card in door target

//nice to have:
// TODO: wait for toilet to refill before flushing
// TODO: Compress all images
// TODO: Better locking - don't breaks hallways
// TODO: plumbingroom - extra lil photoshops 
// TODO: Fix cursor alignment
// TODO: Fix elevator num framing
// TODO: fade time bug
// TODO: pic flicker
// Cursor - tidy edges
// Make screen centered in full screen


// NEW: Make option to fill cup with pool water
// NEW: Ability to leave card anywhere

// idea: instead of lobby/A1, try assigning numbers... so, lB1,cA2, etc... for ease of use
// idea for ease of use: store helper functions at ends of rooms?

const elevatorBoxes = [
    { xy: [.81, .84, .06, .1], fn: () => { setElevatorFloor(1)} }, { xy: [.87, .9, .06, .1], fn: () => { setElevatorFloor(2)} },
    { xy: [.81, .84, .16, .2], fn: () => { setElevatorFloor(3)} }, { xy: [.87, .9, .16, .2], fn: () => { setElevatorFloor(4)} },
    { xy: [.81, .84, .27, .31], fn: () => { setElevatorFloor(5)} }, { xy: [.87, .9, .27, .31], fn: () => { setElevatorFloor(6)} },  
    { xy: [.81, .84, .37, .42], fn: () => { setElevatorFloor(7)} }, { xy: [.87, .9, .37, .42], fn: () => { setElevatorFloor(8)} },
    { xy: [.81, .84, .48, .52], fn: () => { setElevatorFloor(9)} }, { xy: [.87, .9, .48, .52], fn: () => { setElevatorFloor(10)} },
    { xy: [.81, .9, .52, .6], to: 'A3' }, { xy: [.92, 1, .2, .8], to: 'A1', cursor: 'right', transition: 'right' },
    { pic: () => { return 'elevator' + s.floor }, offset: [.82, .97], scale: '6'},
    { pic: () => { return 'floor' + s.floor }, offset: [.471, .65], scale: '6', if: () => { return frame == 'A2b'}}]

const outerElevatorBox = { pic: () => { return  'elevator' + s.elevatorFloor }, offset: [.275, .842], scale: '4' }

const keypadButtons = [
    { xy: [.16, .29, .68, .86], fn: () => { pushKeypad(0) }}, { xy: [.3, .42, .68, .86], fn: () => { pushKeypad(1) }},
    { xy: [.44, .56, .68, .86], fn: () => { pushKeypad(2) }}, { xy: [.58, .7, .68, .86], fn: () => { pushKeypad(3) }},
    { xy: [.72, .84, .68, .86], fn: () => { pushKeypad(4) }}, { xy: [.16, .29, .46, .66], fn: () => { pushKeypad(5) }},
    { xy: [.3, .42, .46, .66], fn: () => { pushKeypad(6) }}, { xy: [.44, .56, .46, .66], fn: () => { pushKeypad(7) }},
    { xy: [.58, .7, .46, .66], fn: () => { pushKeypad(8) }}, { xy: [.72, .84, .46, .66], fn: () => { pushKeypad(9) }}]
// START
const startData = { title: 'Griven', room: 'lobby', frame: 'A1', extension: 'png', frameWidth: 1000, frameHeight: 750 } 

const roomData = {
'opening': {
    'menu': { boxes: [{ xy: [0, 1, 0, 1], to: 'A0' }]},
    'A0': { onEntrance: () => { freeze(); setMusic(null); playSound('music/opening'); setFade(4); goTo('A1');
        wait(4, () => { playGif('opening', 'A2', 4, () => { playSound('music/title'); wait(2, () => { goTo('A3');
        wait(4, () => { goTo('lobby/A1'); wait(4, () => { setFade(1); unfreeze() })})})})})}}},
'brochure': { 0: { right: 1 }, 1: { left: 0, right: 2 }, 2: { left: 1, right: 3 }, 3: { left: 2, right: 4 }, 4: { left: 3 }},
'lobby' : { //zlobby
    'A1': { left: 'A4', right: 'A2', forward: 'B1' },
    'A2': { left: 'A1', right: 'A3', boxes: [{ to: 'A5', xy: [.37, .76, .25, .7] }]},
    'A3': { left: 'A2', right: 'A4' },
    'A4': { left: 'A3', right: 'A1' },
    'A5': { back: 'A2' },
    'B1': { left: 'B4', right: 'B2', forward: () => { playSound('grandUp'); 
        makePic({mov: 'grandUp', totalSteps: 10, delay: .2, destination: 'C1'})},
        //playGif('grandUp', 'C1', 10 * .15)},
        boxes: [{ to: 'D1', xy: [.15, .23, .4, .56] }, { to: 'E1', xy: [.84, .95, .4, .58] }]},
    'B2': { left: 'B1', right: 'B3', forward: 'E2', boxes: [{ xy: [.4, .63, .7, 1], to: 'E4' }]},
    'B3': { left: 'B2', right: 'B4', forward: 'A3' },
    'B4': { left: 'B3', right: 'B1', forward: 'D3', boxes: [{ pic: 'cabinetDown3', if: () => { return s.cabinetDown }}]},
    'C1': { left: 'C4', right: 'C2', boxes: [outerElevatorBox, { xy: [.28, .31, .48, .52],
        to: () => { return s.elevatorFloor == 1 ? 'C1b' : (!s.elevatorFixed ? 'C1a' : null) },
        fn: () => { if (s.elevatorFloor == 1 || !s.elevatorFixed) { playSound('elevatorOpen') } else { callElevator() }}}]},
    'C1a':{ left: () => { playSound('elevatorClose'); return 'C4' }, right: () => { playSound('elevatorClose'); return 'C2' },
        boxes: [outerElevatorBox, { to: 'C5', xy: [.35, .66, .17, .88] },
        { to: 'C1', fn: () => { playSound('elevatorClose') }, xy: [.28, .31, .48, .52] }]},
    'C1b':{ left: () => { playSound('elevatorClose'); return 'C4' }, right: () => { playSound('elevatorClose'); return 'C2' },
        boxes: [outerElevatorBox, { to: 'C1', fn: () => { playSound('elevatorClose') }, xy: [.28, .31, .48, .52] },
        { to: 'elevator/A1', xy: [.35, .66, .17, .88] }]},
    'C2': { left: 'C1', right: 'C3' },
    'C3': { left: 'C2', right: 'C4', forward: () => {  playSound('grandDown'); playGif('grandDown', 'B3', 10 * .15)}},
    'C4': { left: 'C3', right: 'C1', boxes: [{ to: 'C6', xy: [.4, .61, .25, .36] }]},
    'C5': { back: 'C1a' },
    'C6': { back: 'C4' },
    'D1': { left: 'D3', right: 'D2', forward: 'F1'},
    'D2': { left: 'D1', right: 'D3', boxes: [{ to: 'B2', xy: [.2, .4, .2, .8] }, { to: 'B3', xy: [.4, .8, .2, .8] }]},
    'D3': { left: 'D2', right: 'D1', boxes: [{ fn: () => { playSound('bell') }, xy: [.49, .55, .34, .4]},
        { xy: [.84, .88, .57, .64], fn: () => { playSound('lightswitch'); s.lightsOn = !s.lightsOn; refreshCustomBoxes() }},
        { pic: 'switch', if: () => { return s.lightsOn }}, { pic: 'smallKey2', if: () => { return s.smallKey == 2 }},
        { xy: () => { return s.drawers[0] ? [.3, .37, .38, .48] : [.22, .3, .38, .48] }, 
            fn: () => { if (s.smallKey == 2) { playSound('cabinet' + (s.drawers[0] ? 'Close' : 'Open')); changeDrawer(0) }
                else { goTo('D4') }}, if: () => { return !s.cabinetDown }},
        { pic: 'drawer0', if: () => { return s.drawers[0] }},
        { xy: () => { return s.drawers[1] ? [.3, .37, .48, .57] : [.22, .3, .48, .57] }, 
            fn: () => { playSound('cabinet' + (s.drawers[1] ? 'Close' : 'Open')); changeDrawer(1) }, 
            if: () => { return !s.cabinetDown }},
        { pic: 'drawer1', if: () => { return s.drawers[1] }},
        { xy: () => { return s.drawers[2] ? [.3, .37, .57 ,.66] : [.22, .3, .57 ,.66] }, 
            fn: () => { playSound('cabinet' + (s.drawers[2] ? 'Close' : 'Open')); changeDrawer(2) }, 
            if: () => { return !s.cabinetDown }},
        { pic: 'drawer2', if: () => { return s.drawers[2] }},
        { xy: () => { return s.drawers[3] ? [.3, .37, .66 ,.76] : [.22, .3, .66 ,.76] }, 
            fn: () => { playSound('cabinet' + (s.drawers[3] ? 'Close' : 'Open')); changeDrawer(3) }, 
            if: () => { return !s.cabinetDown }},
        { pic: 'drawer3', if: () => { return s.drawers[3] }},
        { pic: 'lightLeft', if: () => { return s.lightsOn && !s.cabinetDown }},
        { pic: () => { return 'lightRight' + (s.smallKey == 1 ? 'Key' : '') }, if: () => { return s.lightsOn }},
        { if: () => { return s.lightsOn && s.smallKey == 1 }, xy: [.58, .64, .41 ,.45], fn: () => { s.smallKey = 0; refresh() }},
        { pic: () => { return 'cabinetDown' + (s.lightsOn ? '2' : '1') }, if: () => { return s.cabinetDown }}],
    toCache: ['lightRight', 'lightRightKey', 'cabinetDown1', 'cabinetDown2']},
    'D4': { back: 'D3', boxes: [{ xy: [.41, .48, .6, .67], id: 'keyhole' }] },
    'E1': { left: 'E3', right: 'E2', boxes: [{ to: 'G1', xy: [.57, .73, .35, .62] }]},
    'E2': { left: 'E1', right: 'E3', boxes: [{ to: 'E4', xy: [.4, .85, .8, 1] }]},
    'E3': { left: 'E2', right: 'E1', boxes: [{ to: 'B3', xy: [.2, .5, .2, .8] }, { to: 'B4', xy: [.5, .8, .2, .8] },
        { if: () => { return s.cabinetDown }, pic: 'cabinetDown4'}]},
    'E4': { back: 'E2', boxes: [{ pic: 'clockHand1', offset: [.485, .81], style: () => { 
            return 'transform: rotate(' + s.clock1 + 'deg); transform-origin: center bottom' }},
        { pic: 'clockHand2', offset: [.48, .73], style: () => { 
            return 'transform: rotate(' + s.clock2 + 'deg); transform-origin: center bottom' }}]},
    'F1': { left: 'F2', right: 'F2', forward: () => {
        s.floor = 2; playSound('stairsUp'); playGif('stairsBottomUp', 'stairs/C1', 13 * .15, () => {
        wait(.5, () => { playSound('stairsUp'); playGif('stairsMiddleUp1', 'stairs/A1', 9 * .15) })})}},
    'F2': { left: 'F1', right: 'F1', forward: 'D2' },
    'G1': { left: 'G2', right: 'G2', forward: 'H1' },
    'G2': { left: 'G1', right: 'G1', forward: 'E3', back: 'H3' },
    'H1': { left: 'H4', right: 'H2', boxes: [{ to: 'I1', xy: [.35, .48, .23, .55] }]},
    'H2': { left: 'H1', right: 'H3', boxes: [{ to: 'pool/A2', xy: [.25, .48, .23, .73] } ]},
    'H3': { left: 'H2', right: 'H4', boxes: [{ to: 'G2', xy: [.25, .5, .2, .6] }]},
    'H4': { left: 'H3', right: 'H1', boxes: [{ xy: [.57, .7, .4, .63], to: () => { if (s.cafeUnlocked) return 'H4a' },
        fn: () => { playSound(s.cafeUnlocked ? 'doorOpen' : 'doorLocked') }}]},
    'H4a': { left: () => { playSound('doorClose'); return 'H3'}, right: () => { playSound('doorClose'); return 'H1'}, 
        boxes: [{ to: 'cafe/A4', xy: [.4, .85, .2, .8] }]},
    'I1': { left: 'I4', right: 'I2', boxes: [{ to: 'I5', xy: [.57, .8, .53, .68] }]},
    'I2': { left: 'I1', right: 'I3', boxes: [{ xy: [.39, .43, .53, .64], fn: () => { 
            playSound('toilet' + (s.valves[0] ? 'Flush' : 'Empty')); makePic({ pic: 'toiletHandle', life: .7}); 
            if (s.valves[0] && s.valves[1] && s.pipe == 2) s.heaterLevel = Math.min(100, s.heaterLevel + 10) }}]},
    'I3': { left: 'I2', right: 'I4', forward: 'H3' },
    'I4': { left: 'I3', right: 'I1' },
    'I5': { back: 'I1' }},
'pool': { //zpool
    'A1': { left: 'A4', right: 'A2', boxes: [{ to: 'A7', xy: [.37, .65, .35, .75] },
        { pic: 'valve0-mini', if: () => { return s.valves[0] }},    
        { pic: 'poolPigKey', if: () => { return s.goldKey == 2 }},
        { pic: 'poolPigKey', if: () => { return s.goldKey == 2 }},
        { pic: 'poolPig', if: () => { return s.pig == 2 & s.goldKey != 2  }}]},
    'A2': { left: 'A1', right: 'A3', forward: 'A5' },
    'A3': { left: 'A2', right: 'A4', boxes: [{ xy: [.54, .65, .3, .51], to: () => { return s.clockUnlocked ? 'A3a' : 'A6' }}]},
    'A3a':{ left: () => { playSound('doorClose'); return 'A2' },
            right: () => { playSound('doorClose'); return 'A4' }, boxes: [{ to: 'B3', xy: [.54, .65, .3, .51] }]},
    'A4': { left: 'A3', right: 'A1', forward: 'lobby/H4' },
    'A5': { back: 'A2'},
    'A6': { back: 'A3', boxes: keypadButtons },
    'A7': { back: 'A1', boxes: [{ xy: [.48, .55, .91, 1], fn: () => { flipValve(0) },
            pic: () => { return s.valves[0] ? 'valve0' : null }}]},
    'B1': { left: 'B4', right: 'B2', forward: 'A1' },
    'B2': { left: 'B1', right: 'B3' },
    'B3': { left: 'B2', right: 'B4', boxes: [{ xy: [.2, .8, .4, 1], fn: () => { playGif('ladderUp', 'clockroom/A3', 10 * .15) }}]},
    'B4': { left: 'B3', right: 'B1' }},
'clockroom' : {
    'A1': { left: 'A4', right: 'A2', forward: () => { playGif('ladderDown', 'pool/B1', 10 * .15) }},
    'A2': { left: 'A1', right: 'A3', boxes: [{ xy: [.29, .34, .42, .48], if: () => { return !s.clockOn }, 
        fn: () => { playSound('gearsRunning'); s.clockOn = true; refreshCustomBoxes()
        if (s.gearsOk) { clockOn() } else { freeze(); wait(4.5, () => { s.clockOn = false; refreshCustomBoxes(); unfreeze() })}}},
        { mov: 'gear1', steps: 3, fate: 'loop', if: () => { return s.clockOn }, while: () => { return s.clockOn }},
        { pic: 'lever', if: () => { return s.clockOn } },
        { xy: [.48, .6, .22, .3], to: 'A5' },
        { xy: [.65, .75, .21, .29], to: 'A6', pic: 'jesusNote', if: () => { return s.jesusCount >= 3 }}]},
    'A3': { left: 'A2', right: 'A4', boxes: [
        // { pic: 'gear2.gif', offset: [0,.6], scale: 10 },
        // { pic: 'gear3.gif', offset: [.77,.82], scale: 23 },
        { mov: 'gear2', steps: 3, fate: 'loop', if: () => { return s.clockOn }},
        { mov: 'gear3', steps: 3, fate: 'loop', if: () => { return s.clockOn }},
        { pic: () => { return 'gear' + s.gears[0] }, offset: [.08, .38], centerOffset: true, rotation: 45 },
        { pic: () => { return 'gear' + s.gears[1] }, offset: [.14, .43], centerOffset: true, rotation: 45 },
        { pic: () => { return 'gear' + s.gears[2] }, offset: [.13, .6], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[3] }, offset: [.19, .67], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[4] }, offset: [.29, .62], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[5] }, offset: [.28, .48], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[6] }, offset: [.29, .47], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[7] }, offset: [.41, .44], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[8] }, offset: [.53, .47], centerOffset: true },
        { pic: () => { return 'gear' + s.gears[9] }, offset: [.65, .61], centerOffset: true },                
        { pic: () => { return 'gear' + s.gears[10] }, offset: [.79, .51], centerOffset: true },
        { pic: 'gearTray0' }, { pic: 'gearTray2' }, { pic: 'gearTray4' }, { pic: 'gearTray6' }, 
        { pic: 'gearTray1' }, { pic: 'gearTray3' }, { pic: 'gearTray5' }]},
    'A4': { alt: { name: 'A4.gif', if: () => { return s.clockOn }}, left: 'A3', right: 'A1', forward: 'A7' },
    'A5': { back: () => { s.jesusCount++; if (s.jesusCount == 3) { freeze(); setMusic(null); playSound('jesus'); 
        wait(2, () => { goTo('A2a'); wait(8, () => { goTo('A2'); setMusic('clockroom'); unfreeze() })})} else { return 'A2' }}},
    'A6': { back: 'A2' },
    'A7': { alt: { name: 'A7.gif', if: () => { return s.clockOn }}, back: 'A4' }},
'cafe': { //zcafe
    'A1': { left: 'A4', right: 'A2', boxes: [{ to: 'A7', xy: [.62, .78, .42, .6] }, { xy: [.3, .35, .5, .6],
        to: () => { return s.plumbUnlocked ? 'A1a' : 'A6' }, fn: () => { if (s.plumbUnlocked) playSound('doorOpen') }}]},
    'A1a': { left: () => { playSound('doorClose'); return 'A4' }, right: () => { playSound('doorClose'); return 'A2'}, 
        boxes: [{ to: 'A5', xy: [.28, .46, .28, .75] }, { to: 'A7', xy: [.62, .78, .42, .6] }]},
    'A2': { left: 'A1', right: 'A3', forward: () => { playSound('doorClose'); return 'lobby/H2' }},
    'A3': { left: 'A2', right: 'A4' },
    'A4': { left: 'A3', right: 'A1', forward: 'B4' },
    'A6': { back: 'A1', boxes: keypadButtons }, 
    'A7': { back: () => { return s.plumbOpen ? 'A1a' : 'A1' }, boxes: [
        { pic: 'coffee1', xy: [.34, .44, .18, .4], cursor: () => { return s.coffee == 2 ? 'forward' : null },
            fn: () => { if (s.coffee == 2) { s.coffee = 0; refresh()}}, if: () => { return s.coffee == 1 || s.coffee == 2 }},
        { xy: [.34, .4, .46, .52], fn: () => { playSound('button')
            if (s.heaterLevel > 0 && !s.valves[2] && s.valves[4] && s.pipe == 3) { 
                playSound('slurp'); s.coffee = 2; refreshCustomBoxes() }
            else { makePic({ pic: 'noWater', life: 1 })}}}]},
    'A5': { forward: 'plumbingroom/A1', back: 'A1a' },
    'B1': { left: 'B4', right: 'B2', boxes: [{ xy: [.2,.8,.4,1], to: 'B5' }]},
    'B2': { left: 'B1', right: 'B3', forward: 'A2' },
    'B3': { left: 'B2', right: 'B4', forward: 'H4' },
    'B4': { left: 'B3', right: 'B1', boxes: [
        { xy: [.4, .53, .3, .39], drag: { x: [.1,.9] }, subBoxes: [{ pic: 'bowl', scale: 100 }]},
        { pic: 'bowlPour' },
        { xy: [.05, .2, .46, .5], fn: () => { s.saladZoom = 0 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[0]] }},
        { xy: [.22, .35, .46, .5], fn: () => { s.saladZoom = 1 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[1]] }},
        { xy: [.38, .51, .46, .5], fn: () => { s.saladZoom = 2 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[2]] }},
        { xy: [.54, .67, .46, .5], to: () => { s.saladZoom = 3 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[3]] }},
        { xy: [.7, .84, .46, .5], to: () => { s.saladZoom = 4 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[4]] }},
        { xy: [.09, .12, .42, .46], fn: () => { saladButton(0);
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.1, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.127, .548], scale: 3.5 })}})}},
        { xy: [.26, .29, .42, .46], fn: () => { saladButton(1)
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.28, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.28, .548], scale: 3.5 })}})}},
        { xy: [.43, .46, .42, .46], fn: () => { saladButton(2);
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.46, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.436, .548], scale: 3.5 })}})}},
        { xy: [.6, .63, .42, .46], fn: () => { saladButton(3) 
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.637, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.59, .548], scale: 3.5 })}})}},
        { xy: [.77, .8, .42, .46], fn: () => { saladButton(4) 
            makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.82, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.747, .548], scale: 3.5 })}})}}]},
    'B5': { back: 'B1'}, 'B6': { back: 'B4'}, 'B6a': { back: 'B4'}, 'B6b': { back: 'B4'},
    'B6c': { back: 'B4', boxes: [
        { pic: () => { return 'salad' + [8, 7, 0, 1, 2][s.saladZoom]}, offset: [.45, .65], style: 'opacity: 50%;' }]}},
'plumbingroom': { //zplumbing
    'A1': { left: 'A4', right: 'A2', boxes: [
        { xy: [.35, .41, .13, .22], fn: () => { setFloorValve(2) }}, { xy: [.41, .48, .13, .22], fn: () => { setFloorValve(3) }},
        { xy: [.48, .54, .13, .22], fn: () => { setFloorValve(4) }}, { xy: [.54, .6, .13, .22], fn: () => { setFloorValve(5) }},
        { xy: [.6, .67, .13, .22], fn: () => { setFloorValve(6) }}, { xy: [.67, .74, .13, .22], fn: () => { setFloorValve(7) }},
        { xy: [.74, .8, .13, .22], fn: () => { setFloorValve(8) }}, { xy: [.8, .86, .13, .22], fn: () => { setFloorValve(9) }},
        { xy: [.86, .93, .13, .22], fn: () => { setFloorValve(10) }}, { pic: () => { return 'valve6-' + s.floorValve }}]},
    'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [{ pic: 'pipe2-2', if: () => { return s.pipe == 2 }},
        { xy: [.92, .99, .31, .41], pic: () => { return s.valves[3] ? 'valve3-2' : null }, fn: () => { flipValve(3) }},
        { pic: 'valve1-mini', if: () => { return s.valves[1] }},
        { pic: 'valve2-mini', if: () => { return s.valves[2] }},
        { pic: 'heaterMeter', scale: 2, offset: () => 
            { return [.37 - (.008 * (s.heaterLevel / 100)), .357 + (.2 * (s.heaterLevel / 100))] }}]},
    'A3': { left: 'A2', right: 'A4', boxes: [
        { xy: [.01, .1, .4, .5], pic: () => { return s.valves[3] ? 'valve3' : null }, fn: () => { flipValve(3) }},
        { xy: [.33, .4, .77, .86], pic: () => { return s.valves[4] ? 'valve4' : null }, fn: () => { flipValve(4) }},
        { xy: [.88, .95, .71, .8], pic: () => { return s.valves[5] ? 'valve5' : null }, fn: () => {  flipValve(5) }}, 
        { xy: [.25, .5, .86, 1], cursor: () => { return s.pipe == 3 ? 'forward' : null }, 
            pic: () => { return s.pipe == 3 ? 'pipe3' : null }, id: 'pipe3',
            fn: () => { if (s.pipe == 3) { s.pipe = 0; refreshCustomBoxes(); refresh() }}}]},
    'A4': { left: 'A3', right: 'A1', boxes: [{ to: 'A5', xy: [.15, .3, .08, .9]},
        { pic: 'valve5-mini', if: () => { return s.valves[5] }},
        { xy: [.6,.7,.25,.32], fn: () => { s.pipe = 0; refreshCustomBoxes(); refresh()},
            pic: 'pipe1', if: () => { return s.pipe == 1 }}]},
    'A5': { forward: () => { playSound('doorClose'); return 'cafe/A3' }, back: 'A4' },
    'B1': { left: 'B4', right: 'B2', boxes: [{ to: 'B5', xy: [.3, .5, .48, .65] }]},
    'B2': { left: 'B1', right: 'B3', boxes: [
        { xy: [.64, .69, .43, .5], pic: () => { return s.valves[1] ? 'valve1' : null }, fn: () => { flipValve(1) }},
        { xy: [.38, .57, .6, .71], cursor: () => { return s.pipe == 2 ? 'forward' : null },
            pic: () => { return s.pipe == 2 ? 'pipe2' : null }, id: 'pipe2',
            fn: () => { if (s.pipe == 2) { s.pipe = 0 }; refreshCustomBoxes(); refresh() }},
        { pic: 'heaterMeter', scale: 3, offset: () => 
            { return [.242 - (.019 * (s.heaterLevel / 100)), .016 + (.383 * (s.heaterLevel / 100))]}}]},
    'B3': { left: 'B2', right: 'B4', boxes: [{ to: 'B6', xy: [.15,.4,.2,.35] },
        { xy: [.53, .6, .49, .58], pic: () => { return s.valves[2] ? 'valve2' : null }, fn: () => { flipValve(2) }}]},
    'B4': { left: 'B3', right: 'B1', forward: 'A4', boxes: [
        { pic: () => { return s.valves[3] ? 'valve3-mini' : null }},
        { pic: 'pipe1-2', if: () => { return s.pipe == 1 }}]}, 
    'B5': { back: 'B1' }, 
    'B6': { back: 'B3' }
},
'stairs': { //zstairs
    'A1': { left: 'A4', right: 'A2', forward: () => { s.floor++; playSound('stairsUp')
        playGif('stairsMiddleUp2', 'C1', 9 * .15, () => { 
            if (s.floor == 10) { clearTimeout(waitId); playGif('stairsTopUp', 'B1', 10 * .15) }
            else playGif('stairsMiddleUp1', 'A1', 9 * .15) })}},
    'A2': { left: 'A1', right: 'A3', forward: () => { s.hallDirection = 1; s.hallPosition = 2; return 'hall/A7' }, 
        boxes: [{ pic: () => { return 'floor' + s.floor }, offset: [.865, .91] }]},
    'A3': { left: 'A2', right: 'A4', forward: () => { s.floor--; playSound('stairsDown')
        playGif('stairsMiddleDown2', 'C1', 9 * .15, () => { playSound('stairsDown');
        if (s.floor == 1) playGif('stairsBottomDown', 'lobby/F2', 9 * .15)
        else playGif('stairsMiddleDown1', 'A3', 10 * .15) })}},
    'A4': { left: 'A3', right: 'A1' },
    'B1': { left: 'B4', right: 'B2', forward: 'B5' },
    'B2': { left: 'B1', right: 'B3', boxes: [{ pic: 'floor10', offset: [.87, .98] }]},
    'B3': { left: 'B2', right: 'B4', forward: () => { if (s.coffee == 3) waitId = wait(60, () => { s.coffee = 4; s.card = 2 })
        s.floor--; playSound('stairsDown'); playGif('stairsTopDown', 'C1', 9 * .15, () => {
        playSound('stairsDown'); playGif('stairsMiddleDown1', 'A3', 10 * .15) })}},
    'B4': { left: 'B3', right: 'B1' },
    'B5': { back: 'B1', boxes: [{ to: 'B5a', fn: () => { playSound('drawer') }, xy: [.37, .52, .63, .78] }]},
    'B5a':{ back: () => { playSound('drawer'); return'B1' }, boxes: [
        { pic: 'card2', xy: [.03,.1,.5,.68], fn: () => { s.card = 0; refresh() }, if: () => { return s.card == 2 }},
        { pic: 'drawerCoffee', if: () => { return s.coffee == 3 }}, { pic: 'drawerNote', if: () => { return s.coffee == 4 }}]}},
'hall': { //zhall
    'A1': { left: () => { hallLeft(); return 'A5' }, right: () => { hallRight(); return 'A5' }, 
        forward: () => { hallForward(); return 'A2' }},
    'A2': { left: () => { hallLeft(); return s.hallPosition == 2 ? 'A7' : (s.hallPosition == 6 ? 'A9' : 'A5')},
        right: () => { hallRight(); return s.hallPosition == 2 ? 'A6' : (s.hallPosition == 6 ? 'A8' : 'A5')},
        forward: () => { hallForward(); return 'A3'}},
    'A3': { left: () => { hallLeft(); return s.hallPosition == 2 ? 'A6' : (s.hallPosition == 6 ? 'A8' : 'A5')},
        right: () => { hallRight(); return s.hallPosition == 2 ? 'A7' : (s.hallPosition == 6 ? 'A9' : 'A5')},
        forward: () => { hallForward(); return 'A4' }},
    'A4': { left: () => { hallLeft(); return 'A5' }, right: () => { hallRight(); return 'A5' }},
    'A5': { left: () => { hallLeft(); return hallTurnLogic() }, right: () => { hallRight(); return hallTurnLogic() },
        boxes: [{ to: 'A10', xy: [.6, .67, .32, .45]}, { pic: () => { return 'roomFloor' + s.floor }, offset: [.44,.94]},
        { pic: () => { return 'room' + (s.hallPosition + (s.hallDirection == 1 ? 1 : 4) 
            + (s.hallPosition < 4 ? 0 : 2) - (s.hallPosition % 4 == 3 ? 1 : 0))}, offset: [.46,.94] }]},
    'A5a': { left: () => { hallLeft(); return hallTurnLogic() }, right: () => { hallRight(); return hallTurnLogic() },
        forward: 'room/A2', boxes: [{ pic: 'roomFloor2', offset: [.44,.94] }, { pic: 'room9', offset: [.46,.94] }]},
    'A6': { left: () => { hallLeft(); return 'A2' }, right: () => { hallRight(); return 'A3' }, forward: 'stairs/A4' },
    'A7': { left: () => { hallLeft(); return 'A3' }, right: () => { hallRight(); return 'A2' }, forward: 'B2'},
    'A8': { left: () => { hallLeft(); return 'A2' }, right: () => { hallRight(); return 'A3'}, forward: 'B4'},
    'A9': { left: () => { hallLeft(); return 'A3' }, right: () => { hallRight(); return 'A2' }},
    'A10': { back: 'A5', boxes: [{ xy: [.5, .72, .2, .35], fn: () => { makePic({ pic: 'doorHandle2', life: .5}); 
        if (s.floor == 2 && s.hallPosition == 7 && s.hallDirection == 1) { playSound('doorOpen'); goTo('A5a') }
        else playSound('doorHandle') }}, { pic: 'card3', if: () => { return s.card == 2 }}]},
    'B1': { left: 'B4', right: 'B2', boxes: [outerElevatorBox, { xy: [.28, .31, .48, .52], 
        to: () => { if (s.floor == s.elevatorFloor) { return 'B1b' } else if (!s.elevatorFixed) return 'B1a' }, 
        fn: () => { if (s.floor == s.elevatorFloor || !s.elevatorFixed) { playSound('elevatorOpen') } else { callElevator() }}}]},
    'B1a': { left: () => { playSound('elevatorClose'); return 'B4' }, right: () => { playSound('elevatorClose'); return 'B2'},
        boxes: [outerElevatorBox, { to: 'B1', fn: () => { playSound('elevatorOpen') }, xy: [.28, .31, .48, .52] },
        { to: 'B5', xy: [.35, .66, .17, .88] }]},
    'B1b': { left: 'B4', right: 'B2', boxes: [outerElevatorBox,  { to: 'elevator/A1', xy: [.35, .66, .17, .88] },
        { to: 'B1', fn: () => { playSound('elevatorOpen') }, xy: [.28, .31, .48, .52] }]},
    'B2': { left: 'B1', right: 'B3', forward: () => { s.hallDirection = 1; s.hallPosition = 6; return 'A9'}},
    'B3': { left: 'B2', right: 'B4', boxes: [{ pic: () => { return 'floor' + s.floor}, offset: [.5,.74] }]},
    'B4': { left: 'B3', right: 'B1', forward: () => { s.hallDirection = 3; s.hallPosition = 2; return 'A6' }},
    'B5': { back: 'B1a' }},
'elevator': { //zelevator
    'A1': { left: () => { return 'A2' + 
            (s.elevatorFloor != s.elevatorGoal ? 'd' : (s.elevatorFloor == 1 ? 'a' : (s.elevatorFloor == 10 ? 'c' : 'b'))) },
        right: () => { return 'A2' + 
            (s.elevatorFloor != s.elevatorGoal ? 'd' : (s.elevatorFloor == 1 ? 'a' : (s.elevatorFloor == 10 ? 'c' : 'b'))) }},
    'A2a': { left: 'A1', forward: () => { playSound('elevatorClose'); return 'lobby/C3'}, boxes: elevatorBoxes },
    'A2b': { left: 'A1', forward: () => { playSound('elevatorClose'); return 'hall/B3'}, boxes: elevatorBoxes },
    'A2c': { left: 'A1', forward: () => { playSound('elevatorClose'); return 'top/A3'}, boxes: elevatorBoxes },
    'A2d': { left: 'A1', boxes: elevatorBoxes },
    'A3': { forward: () => { playSound('panel'); return 'A3a' }, back: () => { 
        return 'A2' + (s.elevatorMoving ? 'd' : (s.floor == 1 ? 'a' : (s.floor == 10 ? 'c' : 'b'))) }},
    'A3a': { back: () => { playSound('panel')
        return 'A2' + (s.elevatorMoving ? 'd' : (s.floor == 1 ? 'a' : (s.floor == 10 ? 'c' : 'b')))}, boxes: [
        { pic: () => { return 'elevatorLight' + (s.elevatorFixed ? 'Green' : 'Red') }, offset: [.47, .96] },
        { xy: [.25, .35, .26, .32], offset: () => { return [[.26, .32], [.295, .32], [.33, .32]][s.circuits[0]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[0] = (s.circuits[0] + 1) % 3; checkCircuits() }},
        { xy: [.38, .5, .22, .27], offset: () => { return [[.385, .28], [.42, .28], [.45, .28], [.487, .28]][s.circuits[1]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[1] = (s.circuits[1] + 1) % 4; checkCircuits() }},
        { xy: [.51, .61, .24, .29], offset: () => { return [[.513, .3], [.56, .3], [.6, .3]][s.circuits[2]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[2] = (s.circuits[2] + 1) % 3; checkCircuits() }},
        { xy: [.645, .71, .2, .25], offset: () => { return [[.65, .25], [.695, .25]][s.circuits[3]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[3] = (s.circuits[3] + 1) % 2; checkCircuits() }},
        { xy: [.38, .47, .48, .55], offset: () => { return [[.383, .55], [.42, .55], [.453, .55]][s.circuits[4]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[4] = (s.circuits[4] + 1) % 3; checkCircuits() }},
        { xy: [.57, .61, .5, .56], offset: () => { return [[.57, .56], [.6, .56]][s.circuits[5]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[5] = (s.circuits[5] + 1) % 2; checkCircuits() }},
        { xy: [.69, .74, .61, .68], offset: () => { return [[.695, .676], [.727, .676]][s.circuits[6]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[6] = (s.circuits[6] + 1) % 2; checkCircuits() }},
        { xy: [.62, .71, .81, .87], offset: () => { return [[.625, .87], [.66, .87], [.695, .87]][s.circuits[7]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[7] = (s.circuits[7] + 1) % 3; refreshCustomBoxes() }},
        { xy: [.655, .68, .5, .55], offset: () => { return [[.65, .51], [.65, .552]][s.circuits[8]]},
            pic: 'circuit2', scale: 4, fn: () => { s.circuits[8] = (s.circuits[8] + 1) % 2; checkCircuits() }},
        { xy: [.45, .5, .72, .8], offset: () => { return [[.455, .738], [.455, .796]][s.circuits[9]]},
            pic: 'circuit2', scale: 4, fn: () => { s.circuits[9] = (s.circuits[9] + 1) % 2; checkCircuits() }}]}},
'room': { //zroom
    'A1': { left: 'A4', right: 'A2', boxes: [{ xy: [.62, .73, .1, .25], id: 'goldKeyhole', 
        pic: () => { return s.goldKey == 4 ? 'goldKey' : null }, to: () => { if (s.goldKey == 4) return 'A1a' },
        fn: () => { playSound(s.goldKey == 4 ? 'doorOpen' : 'doorLocked') }}]},
    'A1a':{ left: () => { playSound('doorClose'); return 'A4' }, right: () => { playSound('doorClose'); return 'A2'},
            forward: () => { playSound('doorClose'); return 'D1' }},
    'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [{ pic: 'fire2', if: () => { return s.fire }}]},
    'A3': { left: 'A2', right: 'A4' },
    'A4': { left: 'A3', right: 'A1', forward: () => {
        playSound('doorClose'); s.hallDirection = 3; s.hallPosition = 7; return 'hall/A5' }},
    'B1': { left: 'B4', right: 'B2', forward: 'C1' },
    'B2': { left: 'B1', right: 'B3', boxes: [{ to: 'B5', xy: [.2, .37, .7, .9] },
        { to: 'B6', xy: [.43, .57, .57, .73] }, { to: 'B7', xy: [.55, .63, .35, .46] },
        { to: () => { return s.fire ? 'B8a' : 'B8' }, xy: [.6, .64, .18, .25] },
        { pic: () => { return s.fire ? 'fire1' : null }}]},
    'B3': { left: 'B2', right: 'B4' },
    'B4': { left: 'B3', right: 'B1', forward: 'A4' },
    'B5': { back: 'B2', forward: 'B5a' },
    'B5a':{ back: 'B2', boxes: [{ xy: [.25, .75, .25, .75], to: 'B5', id: 'pigWindow' }]},
    'B6': { back: 'B2' },
    'B7': { back: 'B2' },
    'B8': { back: 'B2', forward: () => { playSound('lightSwitch'); s.fire = true; return 'B8a' }},
    'B8a':{ back: 'B2', forward: () => { playSound('lightSwitch'); s.fire = false; return 'B8' }},
    'C1': { left: 'C4', right: 'C2' },
    'C2': { left: 'C1', right: 'C3', forward: 'C5' },
    'C3': { left: 'C2', right: 'C4', forward: 'B3' },
    'C4': { left: 'C3', right: 'C1', boxes: [{ to: 'C6', xy: [.41, .57, .71, .93] },
        { if: () => { return s.pig == 1 }, xy: [.25, .35, .4, .53], fn: () => { s.pig = 0; refresh() }},
        { if: () => { return s.pig == 1 }, pic: 'pig' }]},
    'C5': { back: 'C2' },
    'C6': { back: 'C4' },
    'D1': { left: 'D4', right: 'D2', boxes: [{ xy: [.4, .6, .3, .5], to: 'D5' }]},
    'D2': { left: 'D1', right: 'D3', boxes: [
        { pic: 'mirror', offset: [.37, .98], id: 'mirror', style: () => { inRange(0, (2 * s.steamLevel) - 30, 60) + '%' }}]},
    'D3': { left: 'D2', right: 'D4', boxes: [{ xy: [.35, .41, .31, .39], fn: () => { playSound('doorOpen'); goTo('D3a') }}]},
    'D3a': { left: () => { playSound('doorClose'); return 'D2' }, right: () => { playSound('doorClose'); return 'D4' },
            forward: () => { playSound('doorClose'); return 'A3' }},
    'D4': { left: 'D3', right: 'D1', boxes: [
        { xy: [.39, .42, .44, .48], fn: () => { playSound('valve'); s.shower = 1; refreshCustomBoxes() }},
        { xy: [.42, .45, .44, .48], fn: () => { playSound('valve'); s.shower = 0; refreshCustomBoxes() }},
        { xy: [.45, .48, .44, .48], fn: () => { playSound('valve'); s.shower = 2; refreshCustomBoxes(); showerStep() }},
        { if: () => { return s.shower != 0 }, pic: () => { return s.shower == 1 ? 'cold' : 'hot' }},
        { mov: 'shower', steps: 8, delay: .075, fate: 'loop', if: () => { 
            return ((s.floorValve == 2 && s.shower == 1) || showerHot()) }}]},
    'D5': { back: 'D1' },
    'persistents': [{ if: () => { return frame.startsWith('D') }, pic: 'steam/0', style: 'opacity: 0', id: 'steam' }]},
'top': {
    'A1': { left: 'A4', right: 'A2', boxes: [outerElevatorBox,
        { to: 'A1a', fn: () => { playSound('elevatorOpen') }, xy: [.28, .31, .48, .52]}]},
    'A1a': { left: () => { playSound('elevatorClose'); return 'A4' }, 
        right: () => { playSound('elevatorClose'); return 'A2'}, boxes: [outerElevatorBox,
        { to: 'A1', fn: () => { playSound('elevatorClose') }, xy: [.28, .31, .48, .52] },
        { to: 'elevator/A1', xy: [.35, .66, .17, .88] }]},
    'A2': { left: 'A1', right: 'A3' },
    'A3': { left: 'A2', right: 'A4', forward: 'B2' },
    'A4': { left: 'A3', right: 'A1' },
    'B1': { left: 'B2', right: 'B2', forward: 'A1' },
    'B2': { left: 'B1', right: 'B1', forward: 'C2' },
    'C1': { left: 'C2', right: 'C2', forward: 'B1' },
    'C2': { left: 'C1', right: 'C1', boxes: [{ to: 'C3', xy: [.6, .65, .51, .63] }]},
    'C2a':{ left: 'C1', right: 'C1', boxes: [
        { to: 'D3', fn: () => { playSound('doorClose'); playSound('bobb/left') }, xy: [.35, .65, .22, .82] }]},
    'C3': { boxes: keypadButtons, back: 'C2' },    
    'D1': { left: 'D4', right: 'D2', boxes: [{ xy: [.4, .6, .3, .75], fn: () => { playSound('doorLocked') }}]},
    'D2': { left: 'D1', right: 'D3', onEntrance: () => { if (s.bobbSpeech) return 
        freeze(); wait(1, () => { goTo('D5'); setMusic(null); playSound('bobb/speech')
            wait(305, () => { s.bobbSpeech = true; s.otherLeft = false; goTo('D2'); unfreeze() })})}},
    'D3': { left: 'D2', right: () => { if (s.otherLeft) { playSound('bobb/otherLeft'); s.otherLeft = false } return 'D4' }, 
        boxes: [{ xy: [.57, .61, .44, .49], fn: () => { if (!s.bobbSpeech) { playSound('doorLocked'); return }
        freeze(); setMusic(null); playSound('music/end'); playSound('bobb/jump'); hideInventory(); playGif('exit6', 'D6', 13 * .25);
        wait(3.5, () => { setFade(7); goTo('E1'); 
        wait(5, () => { let scream = playSound('scream'); playGif('fall', 'E2', 22 * .1); 
        wait(2, () => { scream.pause(); playSound('splat'); goTo('credits/1') })})})}}]},
    'D4': { left: 'D3', right: 'D1' }},
'credits': {
    1: { onEntrance: () => { setFade(4); wait(4, () => { goTo(2) })}},
    2: { onEntrance: () => { wait(3, () => { goTo(3) })}},
    3: { onEntrance: () => { wait(3, () => { goTo(4) })}},
    4: { onEntrance: () => { wait(4, () => { goTo(5) })}},
    5: { onEntrance: () => { wait(4, () => { goTo(6) })}},
    6: { onEntrance: () => { wait(4, () => { goTo(7) })}},
    7: { onEntrance: () => { wait(4, () => { goTo(8) })}},
    8: { onEntrance: () => { setFade(.2); wait(.2, () => { goTo(9) })}},
    9: { onEntrance: () => { wait(.2, () => { goTo(10) })}},
    10: { onEntrance: () => { wait(.2, () => { goTo(11) })}},
    11: { onEntrance: () => { wait(.2, () => { goTo(12) })}},
    12: { onEntrance: () => { wait(.2, () => { goTo(13) })}},
    13: { onEntrance: () => { wait(.2, () => { goTo(14) })}},
    14: { onEntrance: () => { wait(.2, () => { goTo(15) })}},
    15: { onEntrance: () => { wait(.2, () => { goTo(16) })}},
    16: { onEntrance: () => { wait(.2, () => { goTo(17) })}},
    17: { onEntrance: () => { wait(.2, () => { goTo(18) })}},
    18: { onEntrance: () => { wait(.2, () => { goTo(19) })}},
    19: { onEntrance: () => { wait(3, () => { goTo(20) })}},
    20: { onEntrance: () => { setFade(20); wait(5, () => { goTo('top/D6'); setMusic(null) }); wait(() => {20, goTo('opening/A1')})
}}}}

function showerStep() { //TODO - this should be triggered by any potential change? or, just never stop?
    if (s.steamLevel == 0 && !showerHot()) return
    wait(.2, () => { let steam = get('steam'); let mirror = get('mirror')
        if (showerHot()) { s.steamLevel = Math.min(s.steamLevel + 1, 70); s.heaterLevel = Math.max(s.heaterLevel - 1, 0) }
        else s.steamLevel = Math.max(s.steamLevel - 1, 0)
        if (mirror != null) mirror.style.opacity = inRange(0, (2 * s.steamLevel) - 30, 60) + '%'
        if (steam != null) { steam.src = PIC_PATH + '/steam/' + Math.floor(Math.random() * 9) + '.png'; 
            steam.style.opacity = s.steamLevel + '%' }
        showerStep() })}

function inRange(min, val, max) { return val < min ? min : (val > max ? max : val) }

function showerHot() { return s.heaterLevel > 0 && s.floorValve == 2 && s.valves[2] && !s.valves[4] && s.valves[5] && s.shower == 2 }

function clockOn() { wait(10, () => {
    s.clock1 = (s.clock1 + 1) % 360
    if (s.clock1 % 12 == 0) s.clock2 = (s.clock2 + 1) % 360
    if (s.clock1 == 0 && s.clock2 == 0) { // todo - vary volume, elevator, plumbingroom... vary # of dings???
        if (room == 'lobby' || room == 'pool' || room == 'clockroom') playSound('clock')
        s.cafeUnlocked = true }
    if (frame == 'E4' && room == 'lobby') refreshCustomBoxes()
    clockOn() })}

// non-saveable state
let waitId = 0; let combo = []
// TODO: store variants as separate var? some level of indirection beyond frame and image.

// STATE or, use history.pushState() 
const s = {
/*inventory*/ brochure: 0, smallKey: 1, pipe: 1, coffee: 1, card: 1, pig: 1, goldKey: 1,
/*lobby*/     lightsOn: false, cabinetDown: false, drawers: [false, false, false, false], clock1: 350, clock2: 359,
/*clock*/     clockUnlocked: false, gearsOk: true, clockOn: false, jesusCount: 0, gears: [0, 3, 2, 1, 3, 2, 1, 2, 3, 3, 3],
/*cafe*/      cafeUnlocked: true, saladZoom: 0, salads: [3, 3, 3, 3, 3],
/*plumbing*/  plumbUnlocked: false, plumbOpen: false, valves: [false, true, true, true, true, true], floorValve: 10, heaterLevel: 0,
/*elevator*/  elevatorFloor: 5, elevatorGoal: 5, elevatorMoving: false, elevatorFixed: false, circuits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*hall/room*/ hallPosition: 0, hallDirection: 0, floor: 1, fire: false, speakerVolume: 0, shower: 0, steamLevel: 0, 
/*office*/    officeUnlocked: false, otherLeft: true, bobbSpeech: false }

// official start state.
const s_final = {
/*inventory*/ brochure: 1, smallKey: 1, pipe: 1, coffee: 1, card: 1, pig: 1, goldKey: 1,
/*lobby*/     lightsOn: false, cabinetDown: false, drawers: [false, false, false, false], clock1: 350, clock2: 359,
/*clock*/     clockUnlocked: false, gearsOk: false, clockOn: false, jesusCount: 0, gears: [0, 3, 2, 1, 3, 2, 1, 2, 3, 3, 3],
/*cafe*/      cafeUnlocked: false, saladZoom: 0, salads: [3, 3, 3, 3, 3],
/*plumbing*/  plumbUnlocked: false, plumbOpen: false, valves: [false, true, true, true, true, true], floorValve: 10, heaterLevel: 0,
/*elevator*/  elevatorFloor: 5, elevatorGoal: 5, elevatorMoving: false, elevatorFixed: false, circuits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
/*hall/room*/ hallPosition: 0, hallDirection: 0, floor: 1, fire: false, speakerVolume: 0, shower: 0, steamLevel: 0, 
/*office*/    officeUnlocked: false, otherLeft: true, bobbSpeech: false }

var saved_location
const inventory = {
    brochure: { img: 'brochure', fn: () => { let saved_location = room + '/' + frame; goTo('brochure/0')} },
    smallKey: { img: 'smallkeyFree', targets: [{ id: 'keyhole', fn: () => { s.smallKey = 2; refresh(); 
        if (frame == 'D4') { freeze(); makePic({ pic: 'smallKey1'}); wait(1, () => { goTo('D3'); unfreeze() })}}}]},
    pipe: { img: 'pipeFree', targets: [{ id: 'pipe2', fn: () => { s.pipe = 2; refresh() }},
        { id: 'pipe3', fn: () => { s.pipe = 3; refresh()} }]},
    coffee: { img: 'coffeeFree', targets: [{ frame: 'stairs/B5a', fn: () => { s.coffee = 3; refresh() }}]},
    card: { img: 'cardFree', targets: [{ frame: 'room/A10', fn: () => { s.card = 2 }}]},
    pig: { img: 'pigFree', targets: [{ id: 'pigWindow', fn: () => { playSound('pigFalls'); s.pig = 2; s.goldKey = 2; refresh() }},
        { if: () => { return room == 'stairs' && frame.startsWith('A') },
        fn: () => { playSound('pigFalls'); s.pig = 3; s.goldKey = 3; refreshInventory() }}]},
    goldKey: { state: 1, img: 'goldKeyFree', targets: [{ id: 'goldKeyhole', fn: () => { s.goldKey = 4; refresh() }}]}}

///////// HELPER
function checkCircuits() {
    s.elevatorFixed = (s.circuits[0] == 2 && s.circuits[1] == 0 && s.circuits[2] == 0 && s.circuits[3] == 1 
        && s.circuits[4] == 1 && s.circuits[5] == 0 && s.circuits[6] == 1 && s.circuits[8] == 0 && s.circuits[9] == 1)
    refreshCustomBoxes() }

function changeDrawer(n) {
    s.drawers[n] = !s.drawers[n]
    if (s.drawers[0] && s.drawers[1] && s.drawers[2] && s.drawers[3]) {
        playSound('cabinetDown2'); s.lightsOn = false; s.cabinetDown = true }
    refreshCustomBoxes() }

function pushKeypad(n) {
    playSound('beep'); combo.push(n); if (combo.length > 5) combo.shift()
    if (room == 'pool' && comboIs([3, 5, 2, 9, 9])) { playSound('doorOpen'); goTo('A3a'); s.clockUnlocked = true }
    else if (room == 'cafe' && comboIs([8, 7, 0, 1, 2])) { playSound('doorOpen'); goTo('A1a'); s.plumbUnlocked = s.plumbOpen = true }
    else if (comboIs([1, 2, 6, 6, 9])) { goTo('C2'); freeze(); setMusic(null); playSound('bobb/intro')
        wait(60, () => { s.officeUnlocked = true; goTo('C2a'); playSound('doorOpen'); unfreeze() })}}

function comboIs(goal) { for (i in goal) { if (combo[i] != goal[i]) return false } return true }

function saladButton(n) { playSound('button'); if (s.salads[n] > 0) { playSound('slurp'); s.salads[n]-- }}

function flipValve(n) { playSound('valve'); s.valves[n] = !s.valves[n]; refreshCustomBoxes() }

function setFloorValve(n) { playSound('valve'); s.floorValve = n; refreshCustomBoxes() }

function hallLeft() { s.hallDirection = s.hallDirection == 0 ? 3 : s.hallDirection - 1 }

function hallRight() { s.hallDirection = s.hallDirection == 3 ? 0 : s.hallDirection + 1 }

function hallForward() { s.hallPosition += (s.hallDirection == 0 ? 1 : -1) }

function hallTurnLogic() {
    switch (s.hallPosition % 4) {
        case 0: return s.hallDirection == 0 ? 'A1' : 'A4'
        case 1: return s.hallDirection == 0 ? 'A2' : 'A3'
        case 3: return s.hallDirection == 0 ? 'A4' : 'A1' }}

function callElevator() {
    if (!s.elevatorFixed) return
    s.elevatorGoal = s.floor
    if (s.elevatorMoving) return
    moveElevator() }

function setElevatorFloor(newFloor) {
    playSound('button'); if (!s.elevatorFixed || newFloor == s.elevatorFloor) return
    s.elevatorGoal = newFloor; if (s.elevatorMoving) return
    s.elevatorMoving = true; playSound('elevatorClose'); goTo('A2d')
    wait(2, () => { moveElevator() })}

function moveElevator() {
    if (!s.elevatorFixed) { openElevator(); return }
    if (room == 'elevator') playSound('elevatorBell')
    wait(2, () => { 
        s.elevatorFloor += (s.elevatorGoal > s.elevatorFloor ? 1 : -1)
        if (room == 'elevator') s.floor = s.elevatorFloor
        refreshCustomBoxes()
        if (s.elevatorGoal == s.elevatorFloor) { openElevator(); return }
        moveElevator() })}

function openElevator() {
    if (room == 'elevator') { playSound('elevatorOpen')
        if (frame == 'A2d') goTo('A2' + (s.elevatorFloor == 1 ? 'a' : (s.elevatorFloor == 10 ? 'c' : 'b'))) }
    else if (s.elevatorFloor == s.floor) {
        if (room == 'lobby' && (frame == 'C1' || frame == 'C1a')) { playSound('elevatorOpen'); goTo('C1b') }
        else if (room == 'hall' && (frame == 'B1' || frame == 'B1a')) { playSound('elevatorOpen'); goTo('B1b') }}
    s.elevatorMoving = false }