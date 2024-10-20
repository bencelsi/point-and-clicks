// TODO: non-gif movies
// TODO: Fix inventory sizing
// TODO: Compress all images
// TODO: Add Brochure
// TODO: Clock puzzle
// TODO: Salad puzzle
// TODO: Steam puzzle
// TODO: Mr Bobb animations
// TODO: Credits
// TODO: Better locking - breaks hallways
// TODO: Fix cursor alignment
// TODO: Fix elevator num framing
// TODO: wait for toilet to refill before flushing
// TODO: live update for heater level

// fn/to are redundant? eval should not have side effects.
// idea: instead of lobby/A1, try assigning numbers... so, lB1,cA2, etc... for ease of use
// idea for ease of use: store helper functions at ends of rooms?

const elevatorBoxes = [
    { xy: [.81, .84, .06, .1], fn: () => { setElevatorFloor(1)} },
    { xy: [.87, .9, .06, .1], fn: () => { setElevatorFloor(2)} },
    { xy: [.81, .84, .16, .2], fn: () => { setElevatorFloor(3)} },
    { xy: [.87, .9, .16, .2], fn: () => { setElevatorFloor(4)} },
    { xy: [.81, .84, .27, .31], fn: () => { setElevatorFloor(5)} },
    { xy: [.87, .9, .27, .31], fn: () => { setElevatorFloor(6)} },  
    { xy: [.81, .84, .37, .42], fn: () => { setElevatorFloor(7)} },
    { xy: [.87, .9, .37, .42], fn: () => { setElevatorFloor(8)} },
    { xy: [.81, .84, .48, .52], fn: () => { setElevatorFloor(9)} },
    { xy: [.87, .9, .48, .52], fn: () => { setElevatorFloor(10)} },
    { xy: [.81, .9, .52, .6], to: 'A3' },
    { xy: [.92, 1, .2, .8], to: 'A1', cursor: 'right', transition: 'right' },
    { pic: () => { return 'elevator' + s.floor }, offset: [.82, .97], scale: '6'},
    { pic: () => { return 'floor' + s.floor }, offset: [.471, .65], scale: '6', if: () => { return frame == 'A2b'}}]

const outerElevatorBox = { pic: () => { return  'elevator' + s.elevatorFloor }, offset: [.275, .842], scale: '4'}

const keypadButtons = [
    { xy: [.16, .29, .68, .86], fn: () => { pushKeypad(0) }},
    { xy: [.3, .42, .68, .86], fn: () => { pushKeypad(1) }},
    { xy: [.44, .56, .68, .86], fn: () => { pushKeypad(2) }},
    { xy: [.58, .7, .68, .86], fn: () => { pushKeypad(3) }},
    { xy: [.72, .84, .68, .86], fn: () => { pushKeypad(4) }},
    { xy: [.16, .29, .46, .66], fn: () => { pushKeypad(5) }},
    { xy: [.3, .42, .46, .66], fn: () => { pushKeypad(6) }},
    { xy: [.44, .56, .46, .66], fn: () => { pushKeypad(7) }},
    { xy: [.58, .7, .46, .66], fn: () => { pushKeypad(8) }},
    { xy: [.72, .84, .46, .66], fn: () => { pushKeypad(9) }}]

const gameData = {
    title: 'Griven',
    startRoom: 'opening', startFrame: 'A0',
    extension: 'png',
    frameWidth: 1000, frameHeight: 750,
    // customCursors: true,
    rooms: {
        'opening': {
            'A0': { forward: () => { 
                freeze(); playSound('music/opening'); setFade(4); goTo('A1', 'fade'); wait(4, () => {
                playGif('opening', 'A2', 4, () => {
                playSound('music/title'); wait(2, () => { goTo('A3', 'fade'); wait(4, () => {
                goTo('lobby/A1', 'fade'); wait(4, () => {
                setFade(1); unfreeze() })})})})})}}},
        'lobby' : { //zlobby
            'A1': { left: 'A4', right: 'A2', forward: 'B1' },
            'A2': { left: 'A1', right: 'A3', boxes: [
                { to: 'A5', xy: [.37, .76, .25, .7] }]},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'A5': { back: 'A2' },
            'B1': { left: 'B4', right: 'B2', forward: () => { playSound('grandUp'); 
                playGif('grandUp', 'C1', 10 * .15)}, boxes: [
                    { to: 'D1', xy: [.15, .23, .4, .56] },
                    { to: 'E1', xy: [.84, .95, .4, .58] }]},
            'B2': { left: 'B1', right: 'B3', forward: 'E2', boxes: [
                { xy: [.4, .63, .7, 1], to: 'E4' }]},
            'B3': { left: 'B2', right: 'B4', forward: 'A3' },
            'B4': { left: 'B3', right: 'B1', forward: 'D3', boxes: [
                { pic: 'B4-down', if: () => { return s.cabinetDown } }]},
            'C1': { left: 'C4', right: 'C2', boxes: [ outerElevatorBox,
                { xy: [.28, .31, .48, .52], to: () => { 
                    if (s.elevatorFloor == 1) { playSound('elevatorOpen'); return 'C1b' }
                    else if (!s.elevatorFixed) { playSound('elevatorOpen'); return 'C1a' }
                    else { callElevator() }}}]},
            'C1a':{ left: () => { playSound('elevatorClose'); return 'C4' }, right: () => { playSound('elevatorClose'); return 'C2' },
                boxes: [ outerElevatorBox, { to: 'C5', xy: [.35, .66, .17, .88] },
                { to: () => { playSound('elevatorClose'); return 'C1' }, xy: [.28, .31, .48, .52] }]},
            'C1b':{ left: () => { playSound('elevatorClose'); return 'C4' }, right: () => { playSound('elevatorClose'); return 'C2' },
                boxes: [ outerElevatorBox, { to: () => { playSound('elevatorClose'); return 'C1' }, xy: [.28, .31, .48, .52] },
                { to: 'elevator/A1', xy: [.35, .66, .17, .88] }]},
            'C2': { left: 'C1', right: 'C3' },
            'C3': { left: 'C2', right: 'C4',
                forward: () => {  playSound('grandDown'); playGif('grandDown', 'B3', 10 * .15)}},
            'C4': { left: 'C3', right: 'C1', boxes: [
                { to: 'C6', xy: [.4, .61, .25, .36] }]},
            'C5': { back: 'C1a' },
            'C6': { back: 'C4' },
            'D1': { left: 'D3', right: 'D2', forward: 'F1'},
            'D2': { left: 'D1', right: 'D3', boxes: [
                { to: 'B2', xy: [.2, .4, .2, .8] },
                { to: 'B3', xy: [.4, .8, .2, .8] }]},
            'D3': { left: 'D2', right: 'D1', boxes: [
                { fn: () => { playSound('bell') }, xy: [.49, .55, .34, .4]},
                { xy: [.84, .88, .57, .64], fn: () => { playSound('lightswitch'); s.lightsOn = !s.lightsOn; refreshCustomBoxes() }},
                { pic: 'D3-switch', if: () => { return s.lightsOn }},
                { pic: 'D3-keyin', if: () => { return s.smallKey == 2 }},
                { xy: () => { return s.drawers[0] ? [.3, .37, .38, .48] : [.22, .3, .38, .48] }, 
                    fn: () => { if (s.smallKey == 2) { playSound('cabinet' + (s.drawers[0] ? 'Close' : 'Open')); changeDrawer(0) }
                        else { goTo('D4', 'fade') }}, if: () => { return !s.cabinetDown }},
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
                { pic: 'D3-leftLight', if: () => { return s.lightsOn && !s.cabinetDown }},
                { pic: 'D3-rightLight', if: () => { return s.lightsOn && s.smallKey != 1 }},
                { pic: 'D3-rightLightKey', if: () => { return s.lightsOn && s.smallKey == 1 }},
                { if: () => { return s.lightsOn && s.smallKey == 1 }, xy: [.58, .64, .41 ,.45], fn: () => { s.smallKey = 0; refresh() }},
                { pic: 'D3-downDark', if: () => { return !s.lightsOn && s.cabinetDown }},
                { pic: 'D3-downLight', if: () => { return s.lightsOn && s.cabinetDown }}]},
            'D4': { back: 'D3', boxes: [{ xy: [.41, .48, .6, .67], id: 'keyhole' }] },
            'E1': { left: 'E3', right: 'E2', boxes: [
                { to: 'G1', xy: [.57, .73, .35, .62] }]},
            'E2': { left: 'E1', right: 'E3', boxes: [
                { to: 'E4', xy: [.4, .85, .8, 1] }]},
            'E3': { left: 'E2', right: 'E1', boxes: [
                { to: 'B3', xy: [.2, .5, .2, .8] },
                { to: 'B4', xy: [.5, .8, .2, .8] },
                { if: () => { return s.cabinetDown }, pic: 'E3-down'}]},
            'E4': { back: 'E2', boxes: [
                { pic: 'clockHand1', offset: [.485, .81], style: () => { return 'transform: rotate(' + s.clock1 + 'deg); transform-origin: center bottom' }},
                { pic: 'clockHand2', offset: [.48, .73], style: () => { return 'transform: rotate(' + s.clock2 + 'deg); transform-origin: center bottom' }}]},
            'F1': { left: 'F2', right: 'F2',
                forward: () => { s.floor = 2; 
                    playSound('stairsUp');
                    playGif('stairsBottomUp', 'stairs/C1', 13 * .15, () => {
                        wait(.5, () => {
                            playSound('stairsUp')
                            playGif('stairsMiddleUp1', 'stairs/A1', 9 * .15) })})}},
            'F2': { left: 'F1', right: 'F1', forward: 'D2' },
            'G1': { left: 'G2', right: 'G2', forward: 'H1' },
            'G2': { left: 'G1', right: 'G1', forward: 'E3', back: 'H3' },
            'H1': { left: 'H4', right: 'H2', boxes: [
                { to: 'I1', xy: [.35, .48, .23, .55] }]},
            'H2': { left: 'H1', right: 'H3', boxes: [
                { to: 'pool/A2', xy: [.25, .48, .23, .73] } ]},
            'H3': { left: 'H2', right: 'H4', boxes: [
                { to: 'G2', xy: [.25, .5, .2, .6] }]},
            'H4': { left: 'H3', right: 'H1', boxes: [ { xy: [.57, .7, .4, .63],
                to: () => { if (s.cafeUnlocked) { playSound('doorOpen'); return 'H4a' } else { playSound('doorLocked') }}}]},
            'H4a': { left: () => { playSound('doorClose'); return 'H3'}, 
                    right: () => { playSound('doorClose'); return 'H1'}, boxes: [
                { to: 'cafe/A4', xy: [.4, .85, .2, .8]}]},
            'I1': { left: 'I4', right: 'I2', boxes: [
                { to: 'I5', xy: [.57, .8, .53, .68] }]},
            'I2': { left: 'I1', right: 'I3', boxes: [
                { xy: [.39, .43, .53, .64], fn: () => { 
                    playSound('toilet' + (s.valves[0] ? 'Flush' : 'Empty'))
                    makeEphemeralBox('toiletHandle', 700); 
                    if (s.valves[0] && s.valves[1] && s.pipe == 2) {
                        s.heaterLevel = Math.min(100, s.heaterLevel + 10) }
                 }}]},
            'I3': { left: 'I2', right: 'I4', forward: 'H3' },
            'I4': { left: 'I3', right: 'I1' },
            'I5': { back: 'I1' }
        },
        'pool': { //zpool
            'A1': { left: 'A4', right: 'A2', boxes: [
                { to: 'A7', xy: [.37, .65, .35, .75] },
                { if: () => { return s.goldKey == 2 }, xy: [.28, .37, .12, .2], fn: () => { s.goldKey = 0; refresh() }},    
                { pic: 'poolPigKey', if: () => { return s.goldKey == 2 }},
                { pic: 'poolPig', if: () => { return s.pig == 2 & s.goldKey != 2  }} ]},
            'A2': { left: 'A1', right: 'A3', forward: 'A5' },
            'A3': { left: 'A2', right: 'A4', boxes: [
                { xy: [.54, .65, .3, .51], to: () => { return s.clockUnlocked ? 'A3a' : 'A6' }}]},
            'A3a':{ left: () => { playSound('doorClose'); return 'A2' }, 
                    right: () => { playSound('doorClose'); return 'A4' }, boxes: [
                        { to: 'B3', xy: [.54, .65, .3, .51] }]},
            'A4': { left: 'A3', right: 'A1', forward: 'lobby/H4' },
            'A5': { back: 'A2'},
            'A6': { back: 'A3', boxes: keypadButtons },
            'A7': { back: 'A1', boxes: [
                { xy: [.48, .55, .91, 1], fn: () => { flipValve(0) },
                    pic: () => { return s.valves[0] ? 'valve0' : null }}]},
            'B1': { left: 'B4', right: 'B2', forward: 'A1' },
            'B2': { left: 'B1', right: 'B3' },
            'B3': { left: 'B2', right: 'B4', forward: () => { playGif('ladderUp', 'clockroom/A3', 10 * .15) }},
            'B4': { left: 'B3', right: 'B1' },
        },
        'clockroom' : {
            'A1': { left: 'A4', right: 'A2',
                forward: () => { playGif('ladderDown', 'pool/B1', 10 * .15) }},
            'A2': { alt: { name: 'A2.gif', if: () => { return s.clockRunning }}, left: 'A1', right: 'A3', boxes: [
                { xy: [.29, .34, .42, .48], fn: () => { playSound('gearsRunning'); 
                    s.clockRunning = true; clockOn(); makeEphemeralBox('lever', 1000)}},
                { xy: [.48, .6, .22, .3], to: 'A5' },
                { xy: [.65, .75, .21, .29], to: 'A6', pic: 'jesusNote', if: () => { return s.jesusCount >= 3 }}]},
            'A2a': { onEntrance: () => { freeze(); setMusic(null); playSound('jesus'); wait(9, () => {
                goTo('A2', 'fade'); setMusic('clockroom'); unfreeze() })}},
            'A3': { alt: { name: 'A3.gif', if: () => { return s.clockRunning }},left: 'A2', right: 'A4', boxes: [
                // { pic: 'gear2.gif', offset: [0,.6], scale: 10 },
                // { pic: 'gear3.gif', offset: [.77,.82], scale: 23 },
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
            'A4': { alt: { name: 'A4.gif', if: () => { return s.clockRunning }}, left: 'A3', right: 'A1', forward: 'A7' },
            'A5': { back: () => { s.jesusCount++; if (s.jesusCount == 3) { return 'A2a' }; return 'A2'}},
            'A6': { back: 'A2' },
            'A7': { alt: { name: 'A7.gif', if: () => { return s.clockRunning }}, back: 'A4'}
        },       
        'cafe': { //zcafe
            'A1': { left: 'A4', right: 'A2', boxes: [
                { to: () => { if (s.plumbingUnlocked) { playSound('doorOpen'); return 'A1a' } return 'A6' },
                  xy: [.3, .35, .5, .6] },
                { to: 'A7', xy: [.62, .78, .42, .6] }]},
            'A1a':{ left: () => { playSound('doorClose'); return 'A4' }, right: () => { playSound('doorClose'); return 'A2'}, boxes: [
                { to: 'A5', xy: [.28, .46, .28, .75] },
                { to: 'A7', xy: [.62, .78, .42, .6] }]},
            'A2': { left: 'A1', right: 'A3', forward: () => { playSound('doorClose'); return 'lobby/H2' }},
            'A3': { left: 'A2', right: 'A4', forward: 'H4' },
            'A4': { left: 'A3', right: 'A1', forward: 'B4' },
            'A6': { back: 'A1', boxes: keypadButtons }, 
            'A7': { back: () => { return s.plumbingDoorOpen ? 'A1a' : 'A1' }, boxes: [
                { pic: 'coffee1', xy: [.34, .44, .18, .4], cursor: () => { return s.coffee == 2 ? 'forward' : null },
                    fn: () => { if (s.coffee == 2) { s.coffee = 0; refresh()}},
                    if: () => { return s.coffee == 1 || s.coffee == 2 }},
                { xy: [.34, .4, .46, .52], fn: () => { playSound('button')
                    if (s.heaterLevel >= 0 && !s.valves[2] && s.valves[4] && s.pipe == 3) { playSound('slurp'); s.coffee = 2 }
                    else { makeEphemeralBox('noWater', 1000) }}}]},
            'A5': { forward: 'plumbingroom/A1', back: 'A1a' },
            'B1': { left: 'B4', right: 'B2', boxes: [{ xy: [.2,.8,.4,1], to: 'B5' }]},
            'B2': { left: 'B1', right: 'B3', forward: 'A2' },
            'B3': { left: 'B2', right: 'B4', forward: 'H4' },
            'B4': { left: 'B3', right: 'B1', boxes: [
                { xy: [.05, .2, .46, .5], to: () => { s.currentSalad = 0; return 'B6' + ['c', 'b', 'a', ''][s.salads[0]]}},
                { xy: [.22, .35, .46, .5], to: () => { s.currentSalad = 1; return 'B6' + ['c', 'b', 'a', ''][s.salads[1]]}},
                { xy: [.38, .51, .46, .5], to: () => { s.currentSalad = 2; return 'B6' + ['c', 'b', 'a', ''][s.salads[2]]}},
                { xy: [.54, .67, .46, .5], to: () => { s.currentSalad = 3; return 'B6' + ['c', 'b', 'a', ''][s.salads[3]]}},
                { xy: [.7, .84, .46, .5], to: () => { s.currentSalad = 4; return 'B6' + ['c', 'b', 'a', ''][s.salads[4]]}},
                { xy: [.09, .12, .42, .46], fn: () => { saladButton(0) }},
                { xy: [.26, .29, .42, .46], fn: () => { saladButton(1) }},
                { xy: [.43, .46, .42, .46], fn: () => { saladButton(2) }},
                { xy: [.6, .63, .42, .46], fn: () => { saladButton(3) }},
                { xy: [.77, .8, .42, .46], fn: () => { saladButton(4) }}]},
            'B5': { back: 'B1'},
            'B6': { back: 'B4'},
            'B6a': { back: 'B4'},
            'B6b': { back: 'B4'},
            'B6c': { back: 'B4', boxes: [
                { pic: () => { return 'salad' + [8, 7, 0, 1, 2][s.currentSalad]}, offset: [.45, .65], style: 'opacity: 50%;'},
            ]},
        },
        'plumbingroom': { //zplumbing
            'A1': { left: 'A4', right: 'A2', boxes: [
                { xy: [.35, .41, .13, .22], fn: () => { setFloorValve(2) }},
                { xy: [.41, .48, .13, .22], fn: () => { setFloorValve(3) }},
                { xy: [.48, .54, .13, .22], fn: () => { setFloorValve(4) }},
                { xy: [.54, .6, .13, .22], fn: () => { setFloorValve(5) }},
                { xy: [.6, .67, .13, .22], fn: () => { setFloorValve(6) }},
                { xy: [.67, .74, .13, .22], fn: () => { setFloorValve(7) }},
                { xy: [.74, .8, .13, .22], fn: () => { setFloorValve(8) }},
                { xy: [.8, .86, .13, .22], fn: () => { setFloorValve(9) }},
                { xy: [.86, .93, .13, .22], fn: () => { setFloorValve(10) }},
                { pic: () => { return 'valve6-' + s.floorValve }}]},
            'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [
                { pic: 'pipe2-2', if: () => { return s.pipe == 2 }},
                { xy: [.92, .99, .31, .41], pic: () => { return s.valves[3] ? 'valve3-2' : null }, 
                    fn: () => { flipValve(3) }},
                { pic: 'heaterMeter', scale: 2, 
                    offset: () => { return [.37 - (.008 * (s.heaterLevel / 100)), .357 + (.2 * (s.heaterLevel / 100))] }}]},
            'A3': { left: 'A2', right: 'A4', boxes: [
                { xy: [.01, .1, .4, .5], pic: () => { return s.valves[3] ? 'valve3' : null }, 
                    fn: () => { flipValve(3) }},
                { xy: [.33, .4, .77, .86], pic: () => { return s.valves[4] ? 'valve4' : null }, 
                    fn: () => { flipValve(4) }},
                { xy: [.88, .95, .71, .8], pic: () => { return s.valves[5] ? 'valve5' : null },
                    fn: () => {  flipValve(5) }}, 
                { xy: [.25, .5, .86, 1], pic: () => { return s.pipe == 3 ? 'pipe3' : null }, id: 'pipe3',
                    fn: () => { if (s.pipe == 3) { s.pipe = 0; refreshCustomBoxes(); refresh() }}}]},
            'A4': { left: 'A3', right: 'A1', boxes: 
                [{ to: 'A5', xy: [.15, .3, .08, .9]},
                { xy: [.6,.7,.25,.32], fn: () => { s.pipe = 0; refreshCustomBoxes(); refresh()},
                pic: 'pipe1', if: () => { return s.pipe == 1 }}]},
            'A5': { forward: () => { playSound('doorClose'); return 'cafe/A3' }, back: 'A4' },
            'B1': { left: 'B4', right: 'B2', boxes: [
                { to: 'B5', xy: [.3, .5, .48, .65] }]},
            'B2': { left: 'B1', right: 'B3', boxes: [
                { xy: [.64, .69, .43, .5], pic: () => { return s.valves[1] ? 'valve1' : null }, 
                    fn: () => { flipValve(1)  }},
                { xy: [.38, .57, .6, .71], pic: () => { return s.pipe == 2 ? 'pipe2' : null }, id: 'pipe2',
                    fn: () => { if (s.pipe == 2) { s.pipe = 0 }; refreshCustomBoxes(); refresh() }},
                { pic: 'heaterMeter', scale: 3, 
                    offset: () => { return [.242 - (.019 * (s.heaterLevel / 100)), .016 + (.383 * (s.heaterLevel / 100))] }}
            ]},
            'B3': { left: 'B2', right: 'B4', boxes: [
                { xy: [.53, .6, .49, .58], pic: () => { return s.valves[2] ? 'valve2' : null }, 
                    fn: () => {  flipValve(2) }},
                { to: 'B6', xy: [.15,.4,.2,.35] }]},
            'B4': { left: 'B3', right: 'B1', forward: 'A4'},
            'B5': { back: 'B1' },
            'B6': { back: 'B3' }
        },
        'stairs': { //zstairs
            'A1': { left: 'A4', right: 'A2', 
                forward: () => { 
                    s.floor++; playSound('stairsUp')
                    playGif('stairsMiddleUp2', 'C1', 9 * .15, () => { 
                        if (s.floor === 10) { clearTimeout(topFloorWaitId); playGif('stairsTopUp', 'B1', 10 * .15) }
                        else { playGif('stairsMiddleUp1', 'A1', 9 * .15) }})}},
            'A2': { left: 'A1', right: 'A3', forward: () => { 
                s.hallDirection = 1; s.hallPosition = 2; return 'hall/A7' }, boxes: [
                    { pic: () => { return 'floor' + s.floor}, offset: [.865, .91] }
                ]},
            'A3': { left: 'A2', right: 'A4', 
                forward: () => { s.floor--
                    playSound('stairsDown')
                    playGif('stairsMiddleDown2', 'C1', 9 * .15, () => { 
                        playSound('stairsDown');
                        if (s.floor === 1) { playGif('stairsBottomDown', 'lobby/F2', 9 * .15) } 
                        else { playGif('stairsMiddleDown1', 'A3', 10 * .15) }})}},
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3', boxes: [{ pic: 'floor10', offset: [.87, .98] }]},
            'B3': { left: 'B2', right: 'B4',
                forward: () => { 
                    if (s.coffee == 2) { topFloorWaitId = wait(60, () => { s.coffee = 3; s.card = 2 })}
                    s.floor--; playSound('stairsDown')
                    playGif('stairsTopDown', 'C1', 9 * .15, () => {
                        playSound('stairsDown');
                        playGif('stairsMiddleDown1', 'A3', 10 * .15) })}},
            'B4': { left: 'B3', right: 'B1' },
            'B5': { back: 'B1', boxes: [
                { to: () => { playSound('drawer'); return 'B5a' }, xy: [.37, .52, .63, .78]}]},
            'B5a':{ back: () => { playSound('drawer'); return'B1' }, boxes: [
                { pic: 'card2', xy: [.03,.1,.5,.68], fn: () => { s.card = 0; refresh() },
                    if: () => { return s.card == 2 }},
                { },
                { pic: 'B5a-coffee', if: () => { return s.coffee == 3 }},
                { pic: 'B5a-note', if: () => { return s.coffee == 4 }}
            ]},
            'C1': {}
        },
        'hall': { //zhall
            'A1': { left: () => { hallTurnLeft(); return 'A5' },
                right: () => { hallTurnRight(); return 'A5' },
                forward: () => { hallMoveForward(); return 'A2' }},
            'A2': {
                left: () => { hallTurnLeft(); 
                    return s.hallPosition == 2 ? 'A7' : (s.hallPosition == 6 ? 'A9' : 'A5')},
                right: () => { hallTurnRight(); 
                    return s.hallPosition == 2 ? 'A6' : (s.hallPosition == 6 ? 'A8' : 'A5')},
                forward: () => { hallMoveForward(); return 'A3'}},
            'A3': {
                left: () => { hallTurnLeft(); 
                    return s.hallPosition == 2 ? 'A6' : (s.hallPosition == 6 ? 'A8' : 'A5')},
                right: () => { hallTurnRight(); 
                    return s.hallPosition == 2 ? 'A7' : (s.hallPosition == 6 ? 'A9' : 'A5')},
                forward: () => { hallMoveForward(); return 'A4' }},
            'A4': {
                left: () => { hallTurnLeft(); return 'A5' },
                right: () => { hallTurnRight(); return 'A5' }},
            'A5': {
                left: () => { hallTurnLeft(); return hallTurnLogic() },
                right: () => { hallTurnRight(); return hallTurnLogic() },
                boxes: [{ to: 'A10', xy: [.6, .67, .32, .45]},
                { pic: () => { return 'roomFloor' + s.floor }, offset: [.44,.94]},
                { pic: () => { return 'room' 
                    + (s.hallPosition + (s.hallDirection == 1 ? 1 : 4) + (s.hallPosition < 4 ? 0 : 2) - (s.hallPosition % 4 == 3 ? 1 : 0))}
                , offset: [.46,.94]}
                ]},
            'A5a': {
                left: () => { hallTurnLeft(); return hallTurnLogic() },
                right: () => { hallTurnRight(); return hallTurnLogic() },
                forward: 'room/A2', boxes: [
                    { pic: 'roomFloor2', offset: [.44,.94]},
                    { pic: 'room9', offset: [.46,.94]}]},
            'A6': {
                left: () => { hallTurnLeft(); return 'A2' },
                right: () => { hallTurnRight(); return 'A3' },
                forward: 'stairs/A4' },
            'A7': {
                left: () => { hallTurnLeft(); return 'A3' },
                right: () => { hallTurnRight(); return 'A2' },
                forward: 'B2'},
            'A8': {
                left: () => { hallTurnLeft(); return 'A2'},
                right: () => { hallTurnRight(); return 'A3'},
                forward: 'B4'},
            'A9': {
                left: () => { hallTurnLeft(); return 'A3' },
                right: () => { hallTurnRight(); return 'A2' }},
            'A10': {
                boxes: [
                    { xy: [.5, .72, .2, .35], fn: () => {  makeEphemeralBox('doorHandle2', 500); 
                        if (s.floor == 2 && s.hallPosition == 7 && s.hallDirection == 1) {
                            playSound('doorOpen'); goTo('A5a' , 'fade') } else { playSound('doorHandle');}}}],
                back: 'A5' },
            'B1': { left: 'B4', right: 'B2', boxes: [ outerElevatorBox,
                { xy: [.28, .31, .48, .52], to: () => { 
                    if (s.floor == s.elevatorFloor) { playSound('elevatorOpen'); return 'B1b' }
                    else if (!s.elevatorFixed) { playSound('elevatorOpen'); return 'B1a' }
                    else { callElevator() }}}]},
            'B1a': { left: () => { playSound('elevatorClose'); return 'B4' }, right: () => { playSound('elevatorClose'); return 'B2'},
                boxes: [ outerElevatorBox, { to: () => { playSound('elevatorOpen'); return'B1' }, xy: [.28, .31, .48, .52] },
                { to: 'B5', xy: [.35, .66, .17, .88] }]},
            'B1b': { left: 'B4', right: 'B2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorOpen'); return 'B1'}, xy: [.28, .31, .48, .52] },
                { to: 'elevator/A1', xy: [.35, .66, .17, .88]}]},
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { s.hallDirection = 1; s.hallPosition = 6; return 'A9'}},
            'B3': { left: 'B2', right: 'B4', boxes: [{ pic: () => { return 'floor' + s.floor}, offset: [.5,.74] }]},
            'B4': { left: 'B3', right: 'B1',
                forward: () => { s.hallDirection = 3; s.hallPosition = 2; return 'A6'}},
            'B5': { back: 'B1a' }
        }, 
        'elevator': { //zelevator
            'A1': {
                left: () => { return 'A2' + 
                    (s.elevatorFloor != s.elevatorGoal ? 'd' : (s.elevatorFloor == 1 ? 'a' : (s.elevatorFloor == 10 ? 'c' : 'b'))) },
                right: () => { return 'A2' + 
                    (s.elevatorFloor != s.elevatorGoal ? 'd' : (s.elevatorFloor == 1 ? 'a' : (s.elevatorFloor == 10 ? 'c' : 'b')))}},
            'A2a': { left: 'A1', forward: () => { playSound('elevatorClose'); return 'lobby/C3'}, boxes: elevatorBoxes },
            'A2b': { left: 'A1', forward: () => { playSound('elevatorClose'); return 'hall/B3'}, boxes: elevatorBoxes },
            'A2c': { left: 'A1', forward: () => { playSound('elevatorClose'); return 'top/A3'}, boxes: elevatorBoxes },
            'A2d': { left: 'A1', boxes: elevatorBoxes },
            'A3': { forward: () => { playSound('panel'); return 'A3a' }, back: () => { 
                return 'A2' + (s.elevatorMoving ? 'd' : (s.floor == 1 ? 'a' : (s.floor == 10 ? 'c' : 'b'))) }},
            'A3a': { back: () => { playSound('panel'); 
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
                    pic: 'circuit', scale: 1, fn: () => { s.circuits[7] = (s.circuits[7] + 1) % 3; checkCircuits() }},
                { xy: [.655, .68, .5, .55], offset: () => { return [[.65, .51], [.65, .552]][s.circuits[8]]},
                    pic: 'circuit2', scale: 4, fn: () => { s.circuits[8] = (s.circuits[8] + 1) % 2; checkCircuits() }},
                { xy: [.45, .5, .72, .8], offset: () => { return [[.455, .738], [.455, .796]][s.circuits[9]]},
                    pic: 'circuit2', scale: 4, fn: () => { s.circuits[9] = (s.circuits[9] + 1) % 2; checkCircuits() }},
            ]}
        },
        'room': { //zroom
            'A1': { left: 'A4', right: 'A2', boxes: [
                { xy: [.62, .73, .1, .25], id: 'goldKeyhole', pic: () => { s.goldKey == 4 ? 'A1-key' : null },
                    to: () => { if (s.goldKey == 4) { playSound('doorOpen'); return 'A1a' } else { playSound('doorLocked') }}}]},
            'A1a':{ left: () => { playSound('doorClose'); return 'A4' }, right: () => { playSound('doorClose'); return 'A2'},
                 forward: () => { playSound('doorClose'); return 'D1' }},
            'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [
                { pic: 'fire2', if: () => { return s.fire }}]},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1', forward: () => { playSound('doorClose')
                s.hallDirection = 3; s.hallPosition = 7; return 'hall/A5' }},
            'B1': { left: 'B4', right: 'B2', forward: 'C1' },
            'B2': { left: 'B1', right: 'B3', boxes: [
                { to: 'B5', xy: [.2, .37, .7, .9] },
                { to: 'B6', xy: [.43, .57, .57, .73] },
                { to: 'B7', xy: [.55, .63, .35, .46] },
                { to: () => { return s.fire ? 'B8a' : 'B8' }, xy: [.6, .64, .18, .25] },
                { pic: () => { return s.fire ? 'fire1' : null }}]},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'B5': { back: 'B2', forward: 'B5a' },
            'B5a':{ back: 'B2', boxes: [{ xy: [.25, .75, .25, .75], to: 'B5', id: 'pigWindow' }]},
            'B6': { back: 'B2' },
            'B7': { back: 'B2' },
            'B8': { back: 'B2', forward: () => { playSound('lightSwitch'); s.fire = true; return 'B8a'}},
            'B8a':{ back: 'B2', forward: () => { playSound('lightSwitch'); s.fire = false; return 'B8'}},
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3', forward: 'C5' },
            'C3': { left: 'C2', right: 'C4', forward: 'B3' },
            'C4': { left: 'C3', right: 'C1', boxes: [
                { to: 'C6', xy: [.41, .57, .71, .93] },
                { if: () => { return s.pig == 1 }, xy: [.25, .35, .4, .53], fn: () => { s.pig = 0; refresh() }, },
                { if: () => { return s.pig == 1 }, pic: 'pig' }]},
            'C5': { back: 'C2'},
            'C6': { back: 'C4' },
            'D1': { left: 'D4', right: 'D2', forward: 'D5' },
            'D2': { left: 'D1', right: 'D3', boxes: [
                { pic: 'mirror', offset: [.37, .98] }]},
            'D3': { left: 'D2', right: 'D4', forward: () => { playSound('doorOpen'); return 'D3a' }},
            'D3a': { left: () => { playSound('doorClose'); return 'D2' }, right: () => { playSound('doorClose'); return 'D4' },
                 forward: () => { playSound('doorClose'); return 'A3' }},
            'D4': { left: 'D3', right: 'D1', boxes: [
                { xy: [.39, .42, .44, .48], fn: () => { s.shower = 1; refreshCustomBoxes() }},
                { xy: [.42, .45, .44, .48], fn: () => { s.shower = 0; refreshCustomBoxes() }},
                { xy: [.45, .48, .44, .48], fn: () => { s.shower = 2; refreshCustomBoxes() }},
                { if: () => { return s.shower !== 0 }, pic: () => { return s.shower === 1 ? 'cold' : 'hot' }},
                { if: () => { return s.shower !== 0 }, pic: 'shower.gif', offset: [.5, 1], class: 'fullHeight' }]},
            'D5': { back: 'D1' },
        },
        'top': {
            'A1': { left: 'A4', right: 'A2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorOpen'); return 'A1a'}, xy: [.28, .31, .48, .52]}]},
            'A1a': { left: () => { playSound('elevatorClose'); return 'A4'}, 
                right:  () => { playSound('elevatorClose'); return 'A2'}, boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorClose'); return 'A1'}, xy: [.28, .31, .48, .52]},
                { to: 'elevator/A1', xy: [.35, .66, .17, .88]}]},
            'A2': { left: 'A1', right: 'A3' },
            'A3': { left: 'A2', right: 'A4', forward: 'B2' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B2', right: 'B2', forward: 'A1' },
            'B2': { left: 'B1', right: 'B1', forward: 'C2' },
            'C1': { left: 'C2', right: 'C2', forward: 'B1' },
            'C2': { left: 'C1', right: 'C1', boxes: [
                { to: 'C3', xy: [.6, .65, .51, .63] }]},
            'C2a':{ left: 'C1', right: 'C1', boxes: [
                { to: 'D3', fn: () => { playSound('doorClose'); playSound('bobb/left') }, xy: [.35, .65, .22, .82] }]},
            'C3': { boxes: keypadButtons, back: 'C2' },    
            'D1': { left: 'D4', right: 'D2', boxes: [{xy: [.4, .6, .3, .75], fn: () => { playSound('doorLocked') }}] },
            'D2': { left: 'D1', right: 'D3', onEntrance: () => {
                if (s.bobbSpeech) { return }
                freeze()
                wait(1, () => {
                    goTo('D5', 'fade'); setMusic(null); playSound('bobb/speech')
                    wait(305, () => { s.bobbSpeech = true; unfreeze() })
                })}},
            'D3': { left: 'D2', right: () => { if (!s.otherLeft && !s.bobbSpeech) { playSound('bobb/otherLeft'); s.otherLeft = true; } return 'D4' },
                boxes: [{ xy: [.57, .61, .44, .49], fn: () => {
                    if (s.bobbSpeech) { playSound('bobb/jump'); playSound('music/ending')
                        playGif('exit', 'D6', 13 * .15 + 1, () => {
                            playSound('scream')
                            playGif('fall', 'D6', 22 * .1)})
                    } else { playSound ('doorLocked') }
                }}]},
            'D4': { left: 'D3', right: 'D1' }
        }
    }
}

function clockOn() {
    wait(10, () => {
        s.clock1 = (s.clock1 + 1) % 360
        if (s.clock1 % 12 == 0) { s.clock2 = (s.clock2 + 1) % 360 }
        if (s.clock1 == 0 && s.clock2 == 0) {
            // todo - vary volume, elevator, plumbingroom... vary # of dings???
            if (room == 'lobby' || room == 'pool' || room == 'clockroom') { playSound('clock') } 
            s.cafeUnlocked = true }
        if (frame == 'E4' && room == 'lobby') { refreshCustomBoxes() }
        clockOn() 
    })
}

// min hand: 360 deg -> 3600 sec -

// non-saveable state
let topFloorWaitId = 0
let combo = []
// TODO: store variants as separate var? some level of indirection beyond frame and image.

// STATE or, use history.pushState() 
const s = {
    // inventory:
    smallKey: 1, pipe: 1, coffee: 1, card: 1, pig: 1, goldKey: 1,
    // front desk:
    lightsOn: false, cabinetDown: false, drawers: [false, false, false, false], clock1: 350, clock2: 359,
    //clockroom:
    clockUnlocked: false, clockRunning: false, jesusCount: 0, gears: [0, 3, 2, 1, 3, 2, 1, 2, 3, 3, 3],
    //cafe
    cafeUnlocked: true, currentSalad: 0, salads: [3, 3, 3, 3, 3],
    //plumbingroom:
    plumbingUnlocked: false, plumbingDoorOpen: false, valves: [false, true, true, true, true, true], floorValve: 10, heaterLevel: 0,
    //elevator:
    elevatorFloor: 5, elevatorGoal: 5, elevatorMoving: false, elevatorFixed: false, circuits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // hall 
    hallPosition: 0, hallDirection: 0, floor: 1,
    //room
    fire: false, shower: 0, steamLevel: 0,
    //office
    officeUnlocked: false, otherLeft: false, bobbSpeech: false
}

const inventory = {
    smallKey: { img: 'smallkeyFree', targets: [{ id: 'keyhole', 
        fn: () => { s.smallKey = 2; refresh(); goTo('D3', 'fade') }}]},
    pipe: { img: 'pipeFree', targets: [
        { id: 'pipe2', fn: () => { s.pipe = 2; refresh()} },
        { id: 'pipe3', fn: () => { s.pipe = 3; refresh()} }]},
    coffee: { img: 'coffeeFree', targets: [{ frame: 'stairs/B5a', fn: () => { s.coffee = 3; refresh() }}]},
    card: { img: 'cardFree' },
    pig: { img: 'pigFree', targets: [
        { id: 'pigWindow', fn: () => { playSound('pigFalls'); s.pig = 2; s.goldKey = 2; refresh() }},
        { frames: ['stairs/A1', 'stairs/A2', 'stairs/A3', 'stairs/A4'], fn: () => { playSound('pigFalls'); s.pig = 3; s.goldKey = 3; refreshInventory() }}]},
    goldKey: { state: 1, img: 'goldKeyFree', targets: [{ id: 'goldKeyhole', fn: () => { s.goldKey = 4; refresh() }}]}
}

///////// HELPER
function checkCircuits() {
    s.elevatorFixed = (s.circuits[0] == 2 && s.circuits[1] == 0 && s.circuits[2] == 0 && s.circuits[3] == 1 
        && s.circuits[4] == 1 && s.circuits[5] == 0 && s.circuits[6] == 1 && s.circuits[8] == 0 && s.circuits[9] == 1)
    refreshCustomBoxes()
}

function changeDrawer(n) {
    s.drawers[n] = !s.drawers[n];
    if (s.drawers[0] && s.drawers[1] && s.drawers[2] && s.drawers[3]) {
        playSound('cabinetDown2'); s.lightsOn = false; s.cabinetDown = true }
    refreshCustomBoxes()
}

function pushKeypad(n) {
    playSound('beep'); combo.push(n)
    if (combo.length > 5) { combo.shift() }
    if (room == 'pool' && comboIs([3, 5, 2, 9, 9])) {
        playSound('doorOpen'); goTo('A3a', 'fade'); s.clockUnlocked = true }
    else if (room == 'cafe' && comboIs([8, 7, 0, 1, 2], 'A1a')) {
        s.plumbingUnlocked = true; s.plumbingDoorOpen = true }
    else if (comboIs([1, 2, 6, 6, 9])) {
        goTo('C2', 'fade'); locks++; setMusic(null); playSound('bobb/intro'); 
        wait(82, () => { s.officeUnlocked = true; goTo('C2a', 'fade'); playSound('doorOpen'); locks-- })}
}

function comboIs(goal) {
    for (i in goal) { if (combo[i] != goal[i]) { return false } }
    return true
}

function saladButton(n) {
    playSound('button')
    if (s.salads[n] > 0) { playSound('slurp'); s.salads[n]-- }
}

function flipValve(n) { playSound('valve'); s.valves[n] = !s.valves[n]; refreshCustomBoxes() }

function setFloorValve(n) { playSound('valve'); s.floorValve = n; refreshCustomBoxes() }

function hallTurnLeft() { s.hallDirection = s.hallDirection == 0 ? 3 : s.hallDirection - 1 }

function hallTurnRight() { s.hallDirection = s.hallDirection == 3 ? 0 : s.hallDirection + 1 }

function hallMoveForward() { s.hallPosition += (s.hallDirection == 0 ? 1 : -1) }

function hallTurnLogic() {
    switch (s.hallPosition % 4) {
        case 0: return s.hallDirection == 0 ? 'A1' : 'A4'
        case 1: return s.hallDirection == 0 ? 'A2' : 'A3'
        case 3: return s.hallDirection == 0 ? 'A4' : 'A1'
    }
}

function callElevator() {
    if (!s.elevatorFixed) { return }
    s.elevatorGoal = s.floor
    if (s.elevatorMoving) { return }
    moveElevator()
}

function setElevatorFloor(newFloor) {
    playSound('button')
    if (!s.elevatorFixed || newFloor == s.elevatorFloor) { return }
    s.elevatorGoal = newFloor
    if (s.elevatorMoving) { return }
    s.elevatorMoving = true
    playSound('elevatorClose')
    goTo('A2d', 'fade')
    wait(2, () => { moveElevator() })
}

function moveElevator() {
    if (!s.elevatorFixed) { openElevator(); return}
    if (room == 'elevator') { playSound('elevatorBell') }
    wait(2, () => {
        s.elevatorFloor += (s.elevatorGoal > s.elevatorFloor ? 1 : -1)
        if (room == 'elevator') { s.floor = s.elevatorFloor }
        refreshCustomBoxes()
        if (s.elevatorGoal == s.elevatorFloor) { openElevator(); return }
        moveElevator()
    })}

function openElevator() {
    if (room == 'elevator') { 
        playSound('elevatorOpen')
        if (frame == 'A2d') { goTo('A2' + (s.elevatorFloor == 1 ? 'a' : (s.elevatorFloor == 10 ? 'c' : 'b')), 'fade') }
    } else if (s.elevatorFloor == s.floor) {
        if (room == 'lobby' && (frame == 'C1' || frame == 'C1a')) { playSound('elevatorOpen'); goTo('C1b', 'fade') }
        else if (room == 'hall' && (frame == 'B1' || frame == 'B1a')) { playSound('elevatorOpen'); goTo('B1b', 'fade') }
    }
    s.elevatorMoving = false
}
