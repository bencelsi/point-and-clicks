// TODOs: 
// fix cursors
// change pool image orientations
// add music
// fn/to are redundant?
// idea: instead of lobby/A1, try assigning numbers... so, lB1,cA2, etc... for ease of use
// TODO: you can break halldirections by clicking repeatedly - should block on locks
// TODO: fix elevator num framing
// TODO: switch grandup gif
// TODO: shower gif, clockroom gif
// TODO: fix inventory sizing
// TODO: convert & add sound effects


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
    { pic: () => { return 'scratch/elevator' + s.floor }, offset: [.82, .97], scale: '6'},
    { pic: () => { return 'scratch/floor' + s.floor }, offset: [.471, .65], scale: '6', if: () => { return s.floor > 1 && s.floor < 10}}]

const outerElevatorBox = { pic: () => { return  'scratch/elevator' + s.elevatorFloor }, offset: [.275, .842], scale: '4'}

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
    startRoom: 'opening', startFrame: 'A1',
    extension: 'png',
    frameWidth: 1000, frameHeight: 750,
    // customCursors: true,
    frames: {
        'opening': {
            'A1': { forward: () => { playSound('opening');
                wait(800, () => { playGif('opening', 'A2', 41 * 100) })}},
            'A2': { forward: () => { wait(2000, () => { playSound('moonlight', 1, true ) }); return 'lobby/A1' }}
        },
        'cafe': { //zcafe
            'A1': { left: 'A4', right: 'A2', boxes: [
                { to: () => { if (s.plumbingUnlocked) { playSound('doorOpen.wav'); return 'A1a' } return 'A6' },
                  xy: [.3, .35, .5, .6] },
                { to: 'A7', xy: [.62, .78, .42, .6] }]},
            'A1a':{ left: 'A4', right: 'A2', boxes: [
                { to: 'A5', xy: [.28, .46, .28, .75] },
                { to: 'A7', xy: [.62, .78, .42, .6] }]},
            'A2': { left: 'A1', right: 'A3', forward: 'lobby/H2' },
            'A3': { left: 'A2', right: 'A4', forward: 'H4' },
            'A4': { left: 'A3', right: 'A1', forward: 'B4' },
            'A6': { back: 'A1', boxes: keypadButtons }, 
            'A7': { back: () => { return s.plumbingDoorOpen ? 'A1a' : 'A1' }, boxes: [
                { pic: 'coffee1', xy: [.34, .44, .18, .4], fn: () => { s.coffee = 0; refreshInventory(); refreshCustomBoxes()},
                    if: () => { return s.coffee == 1 }},
                { xy: [.34, .4, .46, .52], fn: () => {
                    if (s.heaterLevel >= 0 && !s.valves[2] && s.valves[4] && s.pipe == 3) { alert('coffeeee') }}}]},
            'A5': { forward: 'plumbingroom/A1', back: 'A1a' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3', forward: 'A2' },
            'B3': { left: 'B2', right: 'B4', forward: 'H4' },
            'B4': { left: 'B3', right: 'B1', boxes: [
                { xy: [.05, .2, .46, .5], to: () => { s.currentSalad = 0; return 'B6' + ['c', 'b', 'a', ''][s.salads[0]]}},
                { xy: [.22, .35, .46, .5], to: () => { s.currentSalad = 1; return 'B6' + ['c', 'b', 'a', ''][s.salads[1]]}},
                { xy: [.38, .51, .46, .5], to: () => { s.currentSalad = 2; return 'B6' + ['c', 'b', 'a', ''][s.salads[2]]}},
                { xy: [.54, .67, .46, .5], to: () => { s.currentSalad = 3; return 'B6' + ['c', 'b', 'a', ''][s.salads[3]]}},
                { xy: [.7, .84, .46, .5], to: () => { s.currentSalad = 4; return 'B6' + ['c', 'b', 'a', ''][s.salads[4]]}},
                { xy: [.09, .12, .42, .46], fn: () => { s.salads[0] -= s.salads[0] == 0 ? 0 : 1 }},
                { xy: [.26, .29, .42, .46], fn: () => { s.salads[1] -= s.salads[1] == 0 ? 0 : 1}},
                { xy: [.43, .46, .42, .46], fn: () => { s.salads[2] -= s.salads[2] == 0 ? 0 : 1}},
                { xy: [.6, .63, .42, .46], fn: () => { s.salads[3] -= s.salads[3] == 0 ? 0 : 1}},
                { xy: [.77, .8, .42, .46], fn: () => { s.salads[3] -= s.salads[3] == 0 ? 0 : 1}}]},
            'B5': { back: 'B1'},
            'B6': { back: 'B4'},
            'B6a': { back: 'B4'},
            'B6b': { back: 'B4'},
            'B6c': { back: 'B4', boxes: [
                { pic: () => { return 'scratch/salad' + [8, 7, 0, 1, 2][s.currentSalad]}, offset: [.45, .65], style: 'opacity: 50%;'},
            ]},
        },
        'elevator': { //zelevator
            'A1': {
                left: () => { return (s.elevatorFloor === 1? 'A2a' : (s.elevatorFloor === 10 ? 'A2c' : 'A2b')) },
                right: () => { return (s.elevatorFloor === 1? 'A2a' : (s.elevatorFloor === 10 ? 'A2c' : 'A2b')) }},
            'A2a': { left: 'A1', forward: () => { playSound('elevatorDoor'); return 'lobby/C3'}, boxes: elevatorBoxes },
            'A2b': { left: 'A1', forward: () => { playSound('elevatorDoor'); return 'hall/B3'}, boxes: elevatorBoxes },
            'A2c': { left: 'A1', forward: () => { playSound('elevatorDoor'); return 'top/A3'}, boxes: elevatorBoxes },
            'A3': { forward: 'A3a', back: () => { return s.floor === 1? 'A2a' : (s.floor === 10 ? 'A2c' : 'A2b') }},
            'A3a': { back: () => { return s.floor === 1? 'A2a' : (s.floor === 10 ? 'A2c' : 'A2b') }, boxes: [
                { pic: 'scratch/elevatorLightGreen', offset: [.47, .96]}
            ]}
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
                { pic: () => { return 'scratch/roomFloor' + s.floor }, offset: [.44,.94]},
                { pic: () => { return 'scratch/room' 
                    + (s.hallPosition + (s.hallDirection == 1 ? 1 : 4) + (s.hallPosition < 4 ? 0 : 2) - (s.hallPosition % 4 == 3 ? 1 : 0))}
                , offset: [.46,.94]}
                ]},
            'A5a': {
                left: () => { hallTurnLeft(); return hallTurnLogic() },
                right: () => { hallTurnRight(); return hallTurnLogic() },
                forward: 'room/A2', boxes: [
                    { pic: 'scratch/roomFloor2', offset: [.44,.94]},
                    { pic: 'scratch/room9', offset: [.46,.94]}]},
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
                    { xy: [.5, .72, .2, .35], fn: () => { makeEphemeralBox('doorHandle2', 1000); 
                        if (s.floor == 2 && s.hallPosition == 7 && s.hallDirection == 1) {
                            playSound('doorOpen.wav'); transition('A5a' , 'fade') }}}],
                back: 'A5' },
            'B1': { left: 'B4', right: 'B2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorDoor');
                    return s.floor === s.elevatorFloor ? 'B1b' : 'B1a' }, xy: [.28, .31, .48, .52] }]},
            'B1a': { left: 'B4', right: 'B2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorDoor'); return'B1' }, xy: [.28, .31, .48, .52] },
                { to: 'B5', xy: [.35, .66, .17, .88] }]},
            'B1b': { left: 'B4', right: 'B2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorDoor'); return 'B1'}, xy: [.28, .31, .48, .52] },
                { to: 'elevator/A1', xy: [.35, .66, .17, .88]}]},
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { s.hallDirection = 1; s.hallPosition = 6; return 'A9'}},
            'B3': { left: 'B2', right: 'B4', boxes: [{ pic: () => { return 'scratch/floor' + s.floor}, offset: [.5,.74] }]},
            'B4': { left: 'B3', right: 'B1',
                forward: () => { s.hallDirection = 3; s.hallPosition = 2; return 'A6'}},
            'B5': { back: 'B1a' }
        },
        'lobby' : { //zlobby
            'A1': { left: 'A4', right: 'A2', forward: 'B1' },
            'A2': { left: 'A1', right: 'A3', boxes: [
                { to: 'A5', xy: [.37, .76, .25, .7] }]},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'A5': { back: 'A2' },
            'B1': { left: 'B4', right: 'B2', forward: () => { playSound('grandUp'); 
                playGif('grandUp', 'C1', 10 * 150)}, boxes: [
                    { to: 'D1', xy: [.15, .23, .4, .56] },
                    { to: 'E1', xy: [.84, .95, .4, .58] }]},
            'B2': { left: 'B1', right: 'B3', forward: 'E2', boxes: [
                { xy: [.4, .63, .7, 1], to: 'E4' }]},
            'B3': { left: 'B2', right: 'B4', forward: 'A3' },
            'B4': { left: 'B3', right: 'B1', forward: 'D3', boxes: [
                { pic: 'B4-down', if: () => { return s.cabinetDown } }]},
            'C1': { left: 'C4', right: 'C2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorDoor'); return s.elevatorFloor === 1 ? 'C1b' : 'C1a' }, 
                    xy: [.28, .31, .48, .52] }]},
            'C1a':{ left: 'C4', right: 'C2', boxes: [ outerElevatorBox,
                { to: 'C1', xy: [.28, .31, .48, .52] },
                { to: 'C5', xy: [.35, .66, .17, .88] }]},
            'C1b':{ left: 'C4', right: 'C2', boxes: [ outerElevatorBox,
                { to: 'elevator/A1', xy: [.35, .66, .17, .88] },
                { to: 'C1', xy: [.28, .31, .48, .52] }]},
            'C2': { left: 'C1', right: 'C3' },  
            'C3': { left: 'C2', right: 'C4', 
                forward: () => {  playSound('grandDown'); playGif('grandDown', 'B3', 10 * 150)}},
            'C4': { left: 'C3', right: 'C1', boxes: [
                { to: 'C6', xy: [.4, .61, .25, .36] }]},
            'C5': { back: 'C1a' },
            'C6': { back: 'C4' },
            'D1': { left: 'D3', right: 'D2', boxes: [
                { to: 'F1', xy: [.4, .5, .35, .61]}]},
            'D2': { left: 'D1', right: 'D3', boxes: [
                { to: 'B2', xy: [.2, .4, .2, .8] },
                { to: 'B3', xy: [.4, .8, .2, .8] }]},
            'D3': { left: 'D2', right: 'D1', boxes: [
                { fn: () => { playSound('bell') }, xy: [.49, .55, .34, .4]},
                { xy: [.84, .88, .57, .64], fn: () => { s.lightsOn = !s.lightsOn; refreshCustomBoxes() }},
                { pic: 'D3-switch', if: () => { return s.lightsOn }},
                { pic: 'D3-keyin', if: () => { return s.smallKey == 2 }},
                { xy: () => { return s.drawers[0] ? [.3, .37, .38, .48] : [.22, .3, .38, .48] }, 
                    fn: () => { s.smallKey == 2 ? changeDrawer(0) : transitionTo('D4', 'fade') }, if: () => { return !s.cabinetDown }},
                { pic: 'drawer0', if: () => { return s.drawers[0] }},
                { xy: () => { return s.drawers[1] ? [.3, .37, .48, .57] : [.22, .3, .48, .57] }, 
                    fn: () => { changeDrawer(1) }, if: () => { return !s.cabinetDown }},
                { pic: 'drawer1', if: () => { return s.drawers[1] }},
                { xy: () => { return s.drawers[2] ? [.3, .37, .57 ,.66] : [.22, .3, .57 ,.66] }, 
                    fn: () => { changeDrawer(2) }, if: () => { return !s.cabinetDown }},
                { pic: 'drawer2', if: () => { return s.drawers[2] }},
                { xy: () => { return s.drawers[3] ? [.3, .37, .66 ,.76] : [.22, .3, .66 ,.76] }, 
                    fn: () => { changeDrawer(3) }, if: () => {return !s.cabinetDown}},
                { pic: 'drawer3', if: () => { return s.drawers[3] }},
                { pic: 'D3-leftLight', if: () => { return s.lightsOn && !s.cabinetDown }},
                { pic: 'D3-rightLight', if: () => { return s.lightsOn && s.smallKey != 1 }},
                { pic: 'D3-rightLightKey', if: () => { return s.lightsOn && s.smallKey == 1 }},
                { if: () => { return s.lightsOn && s.smallKey == 1 }, xy: [.58, .64, .41 ,.45], fn: () => { s.smallKey = 0; refreshInventory(); refreshCustomBoxes() }},
                { pic: 'D3-downDark', if: () => { return !s.lightsOn && s.cabinetDown }},
                { pic: 'D3-downLight', if: () => { return s.lightsOn && s.cabinetDown }}]},
            'D4': { back: 'D3', boxes: [{ xy: [.41, .48, .6, .67], id: 'keyhole' }] },
            'E1': { left: 'E3', right: 'E2', boxes: [
                { to: 'G1', xy: [.57, .73, .35, .62]}]},
            'E2': { left: 'E1', right: 'E3', boxes: [
                { to: 'E4', xy: [.4, .85, .8, 1] }]},
            'E3': { left: 'E2', right: 'E1', boxes: [
                { to: 'B3', xy: [.2, .5, .2, .8] },
                { to: 'B4', xy: [.5, .8, .2, .8] },
                { if: () => { return s.cabinetDown }, pic: 'E3-down'}]},
            'E4': { back: 'E2', boxes: [
                { pic: 'scratch/clockHand1', offset: [.49, .81] },
                { pic: 'scratch/clockHand2', offset: [.485, .73] },
            ]},
            'F1': { left: 'F2', right: 'F2',
                forward: () => { s.floor = 2; 
                    playSound('stairsUp');
                    playGif('stairsBottomUp', 'stairs/C1', 13 * 150, () => {
                        wait('500', () => {
                            playSound('stairsUp')
                            playGif('stairsMiddleUp1', 'stairs/A1', 9 * 150 )})})}},
            'F2': { left: 'F1', right: 'F1', forward: 'D2' },
            'G1': { left: 'G2', right: 'G2', forward: 'H1' },
            'G2': { left: 'G1', right: 'G1', forward: 'E3', back: 'H3' },
            'H1': { left: 'H4', right: 'H2', boxes: [
                { to: 'I1', xy: [.35, .48, .23, .55] }]},
            'H2': { left: 'H1', right: 'H3', boxes: [
                { to: 'pool/A1', xy: [.25, .48, .23, .73] } ]},
            'H3': { left: 'H2', right: 'H4', boxes: [
                { to: 'G2', xy: [.25, .5, .2, .6] }]},
            'H4': { left: 'H3', right: 'H1', boxes: [
                { to: () => { playSound('doorOpen.wav'); return 'H4a'}, xy: [.57, .7, .4, .63] }]},
            'H4a': { left: () => { playSound('doorClose.wav'); return 'H3'}, 
                    right: () => { playSound('doorClose.wav'); return 'H1'}, boxes: [
                { to: 'cafe/A4', xy: [.4, .85, .2, .8]}]},
            'I1': { left: 'I4', right: 'I2', boxes: [
                { to: 'I5', xy: [.57, .8, .53, .68] }]},
            'I2': { left: 'I1', right: 'I3', boxes: [
                { xy: [.39, .43, .53, .64], fn: () => { 
                    playSound(s.valves[0] ? '' : '')
                    makeEphemeralBox('toiletHandle', 1000); 
                    if (s.valves[0] && s.pipe == 2 && s.valves[1]) {
                        heaterLevel = Math.min(100, heaterLevel + 10) }
                 }}]},
            'I3': { left: 'I2', right: 'I4', forward: 'H3' },
            'I4': { left: 'I3', right: 'I1' },
            'I5': { back: 'I1' }
        },
        'pool': { //zpool
            'A1': { left: 'A4', right: 'A2', forward: 'A5' },
            'A2': { left: 'A1', right: 'A3', boxes: [
                { xy: [.54, .65, .3, .51], to: () => { return s.clockUnlocked ? 'A2a' : 'A6' }}]},
            'A2a':{ left: () => { playSound('doorClose.wav'); return 'A1'}, 
                    right: () => { playSound('doorClose.wav'); return 'A3'}, boxes: [
                        { to: 'B2', xy: [.54, .65, .3, .51] }]},
            'A3': { left: 'A2', right: 'A4', forward: 'lobby/H4' },
            'A4': { left: 'A3', right: 'A1', boxes: [
                { to: 'A7', xy: [.37, .65, .35, .75] },
                { if: () => { return s.goldKey == 2 }, xy: [.28, .37, .12, .2], fn: () => { s.goldKey = 0; refreshCustomBoxes(); refreshInventory() }},    
                { pic: 'poolPigKey', if: () => { return s.goldKey == 2 }},
                { pic: 'poolPig', if: () => { return s.pig == 2 & s.goldKey != 2  }} ]},
            'A5': { back: 'A1'},
            'A6': { back: 'A2', boxes: keypadButtons },
            'A7': { back: 'A4', boxes: [
                { xy: [.48, .55, .91, 1], fn: () => { s.valves[0] = !s.valves[0]; refreshCustomBoxes()},
                    pic: () => { return s.valves[0] ? 'valve0' : null }}]},
            'B1': { left: 'B4', right: 'B2' },
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { playGif('ladderUp', 'C2', 10 * 150) }},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'C1': { left: 'C4', right: 'C2', boxes: [
                { to: 'C5', xy: [.48,.6,.22,.3] }]},
            'C2': { left: 'C1', right: 'C3', boxes: [
                { pic: 'gear0' }, { pic: 'gear2' }, { pic: 'gear4' }, { pic: 'gear6'}, 
                { pic: 'gear1' }, { pic: 'gear3' }, { pic: 'gear5' }]},
            'C3': { left: 'C2', right: 'C4', forward: 'C6' },
            'C4': { left: 'C3', right: 'C1',
                forward: () => { playGif('ladderDown', 'B4', 10 * 150) }},
            'C5': { back: 'C1' },
            'C6': { back: 'C3' }
        },
        'stairs': { //zstairs
            'A1': { left: 'A4', right: 'A2', 
                forward: () => { 
                    s.floor++; playSound('stairsUp')
                    playGif('stairsMiddleUp2', 'C1', 9 * 150, () => { 
                        if (s.floor === 10) { clearTimeout(topFloorWaitId); playGif('stairsTopUp', 'B1', 10 * 150) }
                        else { playGif('stairsMiddleUp1', 'A1', 9 * 150) }})}},
            'A2': { left: 'A1', right: 'A3', forward: () => { 
                s.hallDirection = 1; s.hallPosition = 2; return 'hall/A7' }, boxes: [
                    { pic: () => { return 'scratch/floor' + s.floor}, offset: [.865, .91] }
                ]},
            'A3': { left: 'A2', right: 'A4', 
                forward: () => { s.floor--
                    playSound('stairsDown')
                    playGif('stairsMiddleDown2', 'C1', 9 * 150, () => { 
                        playSound('stairsDown');
                        if (s.floor === 1) { playGif('stairsBottomDown', 'lobby/F2', 9 * 150) } 
                        else { playGif('stairsMiddleDown1', 'A3', 10 * 150) }})}},
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3', boxes: [{ pic: 'scratch/floor10', offset: [.87, .98] }]},
            'B3': { left: 'B2', right: 'B4',
                forward: () => { 
                    if (s.coffee == 2) { topFloorWaitId = wait(60000, () => { s.coffee = 3; s.card = 2 })}
                    s.floor--; playSound('stairsDown')
                    playGif('stairsTopDown', 'C1', 9 * 150, () => {
                        playSound('stairsDown');
                        playGif('stairsMiddleDown1', 'A3', 10 * 150) })}},
            'B4': { left: 'B3', right: 'B1' },
            'B5': { back: 'B1', boxes: [
                { to: () => { playSound('drawer'); return 'B5a' }, xy: [.37, .52, .63, .78]}]},
            'B5a':{ back: () => { playSound('drawer'); return'B1' }, boxes: [
                { pic: 'card2', xy: [.03,.1,.5,.68], fn: () => { s.card = 0; refreshInventory(); refreshCustomBoxes() },
                    if: () => { return s.card == 2 }},
                { },
                { pic: 'B5a-coffee', if: () => { return s.coffee == 2 }},
                { pic: 'B5a-note', if: () => { return s.coffee == 3 }}
            ]},
            'C1': {}
        },
        'plumbingroom': { //zplumbing
            'A1': { left: 'A4', right: 'A2', boxes: [
                { xy: [.35, .41, .13, .22], fn: () => { s.valves[6] = 2; refreshCustomBoxes() }},
                { xy: [.41, .48, .13, .22], fn: () => { s.valves[6] = 3; refreshCustomBoxes() }},
                { xy: [.48, .54, .13, .22], fn: () => { s.valves[6] = 4; refreshCustomBoxes() }},
                { xy: [.54, .6, .13, .22], fn: () => { s.valves[6] = 5; refreshCustomBoxes() }},
                { xy: [.6, .67, .13, .22], fn: () => { s.valves[6] = 6; refreshCustomBoxes() }},
                { xy: [.67, .74, .13, .22], fn: () => { s.valves[6] = 7; refreshCustomBoxes() }},
                { xy: [.74, .8, .13, .22], fn: () => { s.valves[6] = 8; refreshCustomBoxes() }},
                { xy: [.8, .86, .13, .22], fn: () => { s.valves[6] = 9; refreshCustomBoxes() }},
                { xy: [.86, .93, .13, .22], fn: () => { s.valves[6] = 10; refreshCustomBoxes() }},
                { pic: () => { return 'valve6-' + s.valves[6] }}]},
            'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [
                { pic: 'pipe2-2', if: () => { return s.pipe == 2 }},
                { xy: [.92, .99, .31, .41], pic: () => { return s.valves[3] ? 'valve3-2' : null }, 
                    fn: () => { s.valves[3] = !s.valves[3]; refreshCustomBoxes() }},
                { pic: 'scratch/heaterMeter', offset: [.37, .4], scale: 2 }]},
            'A3': { left: 'A2', right: 'A4', boxes: [
                { xy: [.01, .1, .4, .5], pic: () => { return s.valves[3] ? 'valve3' : null }, 
                    fn: () => { s.valves[3] = !s.valves[3]; refreshCustomBoxes() }},
                { xy: [.33, .4, .77, .86], pic: () => { return s.valves[4] ? 'valve4' : null }, 
                    fn: () => { s.valves[4] = !s.valves[4]; refreshCustomBoxes() }},
                { xy: [.88, .95, .71, .8], pic: () => { return s.valves[5] ? 'valve5' : null },
                    fn: () => { s.valves[5] = !s.valves[5]; refreshCustomBoxes() }}, 
                { xy: [.25, .5, .86, 1], pic: () => { return s.pipe == 3 ? 'pipe3' : null }, id: 'pipe3',
                    fn: () => { if (s.pipe == 3) { s.pipe = 0; refreshCustomBoxes(); refreshInventory() }}}]},
            'A4': { left: 'A3', right: 'A1', boxes: 
                [{ to: 'A5', xy: [.15, .3, .08, .9]},
                { xy: [.6,.7,.25,.32], fn: () => { s.pipe = 0; refreshCustomBoxes(); refreshInventory()},
                pic: 'pipe1', if: () => { return s.pipe == 1 }}]},
            'A5': { forward: () => { playSound('doorClose.wav'); return 'cafe/A3' }, back: 'A4' },
            'B1': { left: 'B4', right: 'B2', boxes: [
                { to: 'B5', xy: [.3, .5, .48, .65] }]},
            'B2': { left: 'B1', right: 'B3', boxes: [
                { xy: [.64, .69, .43, .5], pic: () => { return s.valves[1] ? 'valve1' : null }, 
                    fn: () => { s.valves[1] = !s.valves[1]; refreshCustomBoxes() }},
                { xy: [.38, .57, .6, .71], pic: () => { return s.pipe == 2 ? 'pipe2' : null }, id: 'pipe2',
                    fn: () => { if (s.pipe == 2) { s.pipe = 0 }; refreshCustomBoxes(); refreshInventory() }},
                { pic: 'scratch/heaterMeter', offset: [.22, .3], scale: 4 }
            ]},
            'B3': { left: 'B2', right: 'B4', boxes: [
                { xy: [.53, .6, .49, .58], pic: () => { return s.valves[2] ? 'valve2' : null }, 
                    fn: () => { s.valves[2] = !s.valves[2]; refreshCustomBoxes() }},
                { to: 'B6', xy: [.15,.4,.2,.35] }]},
            'B4': { left: 'B3', right: 'B1', forward: 'A4'},
            'B5': { back: 'B1' },
            'B6': { back: 'B3' }
        },
        'room': { //zroom
            'A1': { left: 'A4', right: 'A2', boxes: [
                { xy: [.62, .73, .1, .25], to: () => { return s.goldKey == 4 ? 'A1a' : null }, 
                    id: 'goldKeyhole', pic: 'A1-key' },
                { pic: 'A1-key', if: () => { s.goldKey == 4 }}]},
            'A1a':{ left: 'A4', right: 'A2', forward: 'D1' },
            'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [
                { pic: 'A2-fire', if: () => { return s.fire }}]},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1', forward: () => { 
                s.hallDirection = 3; s.hallPosition = 7; return 'hall/A5' }},
            'B1': { left: 'B4', right: 'B2', forward: 'C1' },
            'B2': { left: 'B1', right: 'B3', boxes: [
                { to: 'B5', xy: [.2, .37, .7, .9] },
                { to: 'B6', xy: [.43, .57, .57, .73] },
                { to: 'B7', xy: [.55, .63, .35, .46] },
                { to: () => { return s.fire ? 'B8a' : 'B8' }, xy: [.6, .64, .18, .25] },
                { pic: 'B2-fire', if: () => { return s.fire }}]},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'B5': { back: 'B2', forward: 'B5a' },
            'B5a':{ back: 'B2', boxes: [{ xy: [.25, .75, .25, .75], to: 'B5', id: 'pigWindow' }]},
            'B6': { back: 'B2' },
            'B7': { back: 'B2' },
            'B8': { back: 'B2', forward: () => { s.fire = true; return 'B8a'}},
            'B8a':{ back: 'B2', forward: () => { s.fire = false; return 'B8'}},
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3', forward: 'C5' },
            'C3': { left: 'C2', right: 'C4', forward: 'B3' },
            'C4': { left: 'C3', right: 'C1', boxes: [
                { to: 'C6', xy: [.41, .57, .71, .93] },
                { if: () => { return s.pig == 1 }, xy: [.25, .35, .4, .53], fn: () => { s.pig = 0; refreshCustomBoxes(); refreshInventory() }, },
                { if: () => { return s.pig == 1 }, pic: 'pig' }]},
            'C5': { back: 'C2'},
            'C6': { back: 'C4' },
            'D1': { left: 'D4', right: 'D2', forward: 'D5' },
            'D2': { left: 'D1', right: 'D3', boxes: [
                { pic: 'scratch/mirror', offset: [.37, .98] }
            ]},
            'D3': { left: 'D2', right: 'D4', forward: 'D3a' },
            'D3a': { left: 'D2', right: 'D4', forward: 'A3' },
            'D4': { left: 'D3', right: 'D1', boxes: [
                { xy: [.39, .42, .44, .48], fn: () => { s.shower = 1; refreshCustomBoxes() }},
                { xy: [.42, .45, .44, .48], fn: () => { s.shower = 0; refreshCustomBoxes() }},
                { xy: [.45, .48, .44, .48], fn: () => { s.shower = 2; refreshCustomBoxes() }},
                { if: () => { return s.shower !== 0 }, pic: () => { return s.shower === 1 ? 'cold' : 'hot' }},
                { if: () => { return s.shower !== 0 }, pic: 'shower.gif', offset: [.5, 1], class: 'fullHeight'}]},
            'D5': { back: 'D1' }
        },
        'top': {
            'A1': { left: 'A4', right: 'A2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorDoor'); return 'A1a'}, xy: [.28, .31, .48, .52]}]},
            'A1a':{ left: 'A4', right: 'A2', boxes: [ outerElevatorBox,
                { to: () => { playSound('elevatorDoor'); return 'A1'}, xy: [.28, .31, .48, .52]},
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
                { to: 'D3', xy: [.35, .65, .22, .82] }]},
            'C3': { boxes: keypadButtons, back: 'C2' },    
            'D1': { left: 'D4', right: 'D2', forward: 'C1' },
            'D2': { left: 'D1', right: 'D3', forward: 'D5' },
            'D3': { left: 'D2', right: 'D4', forward: 
                () => { playGif('exit', 'C1', 13 * 150 + 200, 
                    () => { playGif('fall', 'opening/A1', 22 * 100) }); s.floor = 1; }},
            'D4': { left: 'D3', right: 'D1' },
            'D5': { back: 'D2' }
        },
    }
}

// non-saveable state
let topFloorWaitId = 0

let combo = []
// TODO: store variants as separate var? some level of indirection beyond frame and image.

// Saveable State
const s = {
    // inventory:
    smallKey: 1, pipe: 1, coffee: 1, card: 1, pig: 1, goldKey: 1,
    // front desk:
    lightsOn: false, cabinetDown: false, drawers: [false, true, false, true],
    //clockroom:
    clockUnlocked: false,
    gears: [],
    //cafe
    cafeUnlocked: false,
    currentSalad: 0,
    salads: [3, 3, 3, 3, 3],
    //plumbingroom:
    plumbingUnlocked: false,
    plumbingDoorOpen: false,
    valves: [false, true, true, true, true, true, 10],
    heaterLevel: 0,
    // hall 
    hallPosition: 0,
    hallDirection: 0,
    floor: 1,
    elevatorFloor: 1,
    circuits: [],
    //room
    fire: false,
    shower: 0,

    officeUnlocked: false,
}

const inventory = {
    smallKey: { img: 'smallkeyFree', targets: [{ id: 'keyhole', 
        fn: () => { s.smallKey = 2; refreshInventory(); transitionTo('D3', 'fade'); }}]},
    pipe: { img: 'pipeFree', targets: [
        { id: 'pipe2', fn: () => { s.pipe = 2; refreshCustomBoxes(); refreshInventory()} },
        { id: 'pipe3', fn: () => { s.pipe = 3; refreshCustomBoxes(); refreshInventory()} }]},
    coffee: { img: 'coffeeFree', targets: [{ frame: 'stairs/B5a', fn: () => { s.coffee = 2; refreshInventory(); refreshCustomBoxes() }}] },
    card: { img: 'cardFree' },
    pig: { img: 'pigFree', targets: [
        { id: 'pigWindow', fn: () => { s.pig = 2; s.goldKey = 2; refreshInventory() }},
        { frames: ['stairs/A1', 'stairs/A2', 'stairs/A3', 'stairs/A4'], fn: () => { s.pig = 3; s.goldKey = 3; refreshInventory() }}]},
    goldKey: { state: 1, img: 'goldKeyFree', targets: [{ id: 'goldKeyhole', fn: () => { s.goldKey = 4; refreshInventory()}}] }
}

function changeDrawer(n) {
    s.drawers[n] = !s.drawers[n];
    if (s.drawers[0] && s.drawers[1] && s.drawers[2] && s.drawers[3]) {
        s.lightsOn = false; s.cabinetDown = true }
    refreshCustomBoxes()
}

function pushKeypad(n) {
    // playSound()
    combo.push(n)
    if (combo.length > 5) { combo.shift() }
    if (room == 'pool') { if (checkCombo([3, 5, 2, 9, 9], 'A2a')) {
        s.clockUnlocked = true  }} 
    else if (room == 'cafe') { if (checkCombo([8, 7, 0, 1, 2], 'A1a')) {
        s.plumbingUnlocked = true; s.plumbingDoorOpen = true }}
    else { if (checkCombo([1, 2, 6, 6, 9], 'C2a')) {
        s.officeUnlocked = true }}
}

function checkCombo(desired, destination) {
    for (i in desired) { if (combo[i] != desired[i]) { return false } }
    playSound('doorOpen.wav'); transitionTo(destination, 'fade'); return true
}

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

function setElevatorFloor(floor) {
    playSound('elevatorBell')
    s.elevatorFloor = s.floor = floor
    let newFrame = s.elevatorFloor === 1 ? 'A2a' : (s.elevatorFloor === 10 ? 'A2c' : 'A2b')
    transitionTo(newFrame, 'fade')
}