// TODOs: 
// fix cursors
// change pool image orientations
// add music
// better way to set room... like: forward: {'cafe' : 'A1'}... or just 'lobby-A1'
// click/to are redundant?

let elevatorButtons = [
    { hitbox: [.81, .84, .06, .1], click: () => { setElevatorFloor(1)} },
    { hitbox: [.87, .9, .06, .1], click: () => { setElevatorFloor(2)} },
    { hitbox: [.81, .84, .16, .2], click: () => { setElevatorFloor(3)} },
    { hitbox: [.87, .9, .16, .2], click: () => { setElevatorFloor(4)} },
    { hitbox: [.81, .84, .27, .31], click: () => { setElevatorFloor(5)} },
    { hitbox: [.87, .9, .27, .31], click: () => { setElevatorFloor(6)} },  
    { hitbox: [.81, .84, .37, .42], click: () => { setElevatorFloor(7)} },
    { hitbox: [.87, .9, .37, .42], click: () => { setElevatorFloor(8)} },
    { hitbox: [.81, .84, .48, .52], click: () => { setElevatorFloor(9)} },
    { hitbox: [.87, .9, .48, .52], click: () => { setElevatorFloor(10)} },
    { hitbox: [.81, .9, .52, .6], to: 'A3' },
    { hitbox: [.92, 1, .2, .8], to: 'A1', cursor: 'right', transition: 'right' }
]

const gameData = {
    title: 'Griven',
    startRoom: 'opening',
    startFrame: 'A1',
    extension: 'png',
    frameWidth: 1000,
    frameHeight: 750,
    // customCursors: true,
    frames: {
        'opening': {
            'A1': { forward: () => { playSound('opening');
                wait(800, () => { playGif('opening', 'A2', 41 * 100) })}},
            'A2': { forward: () => { /*playSound('moonlight', 1, true);*/ return 'lobby/A1' }}
        },
        'cafe': {
            'A1': { left: 'A4', right: 'A2', boxes: [
                { to: 'A6', hitbox: [.3, .35, .5, .6] },
                { to: 'A7', hitbox: [.62, .78, .42, .6] }]},
            'A1a':{ left: 'A4', right: 'A2', boxes: [
                { to: 'A5', hitbox: [.28, .46, .28, .75] },
                { to: 'A7', hitbox: [.62, .78, .42, .6] }]},
            'A2': { left: 'A1', right: 'A3', forward: 'lobby/H2' },
            'A3': { left: 'A2', right: 'A4', forward: 'H4' },
            'A4': { left: 'A3', right: 'A1', forward: 'B4' },
            'A6': { forward: () => { plumbingDoorOpen = true; return 'A1a' }}, 
            'A7': { back: () => { return plumbingDoorOpen ? 'A1a' : 'A1' }},
            'A5': { forward: 'plumbingroom/A1', back: 'A1a' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3', forward: 'A2' },
            'B3': { left: 'B2', right: 'B4', forward: 'H4' },
            'B4': { left: 'B3', right: 'B1', forward: 'B6' },
            'B5': { back: 'B1'},
            'B6': { back: 'B4'}
        },
        'elevator': {
            'A1': {
                left: () => { return (s.elevatorFloor === 1? 'A2a' : (s.elevatorFloor === 10 ? 'A2c' : 'A2b')) },
                right: () => { return (s.elevatorFloor === 1? 'A2a' : (s.elevatorFloor === 10 ? 'A2c' : 'A2b')) }},
            'A2a': { left: 'A1', forward: 'lobby/C3', boxes: elevatorButtons },
            'A2b': { left: 'A1', forward: 'hall/B3', boxes: elevatorButtons },
            'A2c': { left: 'A1', forward: 'top/A3', boxes: elevatorButtons },
            'A3': { forward: 'A3a', back: () => { return s.floor === 1? 'A2a' : (s.floor === 10 ? 'A2c' : 'A2b') }},
            'A3a': { back: () => {return s.floor === 1? 'A2a' : (s.floor === 10 ? 'A2c' : 'A2b')}}
        },
        'hall': {
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
                forward: 'A5a' },
            'A5a': {
                left: () => { hallTurnLeft(); return hallTurnLogic() },
                right: () => { hallTurnRight(); return hallTurnLogic() },
                forward: 'room/A2' },
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
            'B1': { left: 'B4', right: 'B2', boxes: [
                { to: () => { playSound('elevatorDoor');
                    return s.floor === s.elevatorFloor ? 'B1b' : 'B1a' }, hitbox: [.28, .31, .48, .52] }]},
            'B1a': { left: 'B4', right: 'B2', boxes: [
                { to: 'B1', hitbox: [.28, .31, .48, .52] },
                { to: 'B5', hitbox: [.35, .66, .17, .88] }]},
            'B1b': { left: 'B4', right: 'B2', boxes: [
                { to: 'B1', hitbox: [.28, .31, .48, .52] },
                { to: 'elevator/A1', hitbox: [.35, .66, .17, .88]}]},
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { s.hallDirection = 1; s.hallPosition = 6; return 'A9'}},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1',
                forward: () => { s.hallDirection = 3; s.hallPosition = 2; return 'A6'}},
            'B5': { back: 'B1a' }
        },
        'lobby' : { //zlb
            'A1': { left: 'A4', right: 'A2', forward: 'B1' },
            'A2': { left: 'A1', right: 'A3', boxes: [
                { to:'A5', hitbox: [.37, .76, .25, .7] }]},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'A5': { back: 'A2' },
            'B1': { left: 'B4', right: 'B2', forward: () => { playSound('grandUp'); 
                playGif('grandUp', 'C1', 10 * 150)}, 
                boxes: [
                    { to: 'D1', hitbox: [.15, .23, .4, .56] },
                    { to: 'E1', hitbox: [.84, .95, .4, .58] }]},
            'B2': { left: 'B1', right: 'B3', forward: 'E2' },
            'B3': { left: 'B2', right: 'B4', forward: 'A3' },
            'B4': { left: 'B3', right: 'B1', forward: 'D3' },
            'C1': { left: 'C4', right: 'C2', boxes: [
                { to: () => { playSound('elevatorDoor');
                    return s.elevatorFloor === 1 ? 'C1b' : 'C1a' }, hitbox: [.28, .31, .48, .52] }]},
            'C1a':{ left: 'C4', right: 'C2', boxes: [
                { to: 'C1', hitbox: [.28, .31, .48, .52] },
                { to: 'C5', hitbox: [.35, .66, .17, .88] }]},
            'C1b':{ left: 'C4', right: 'C2', boxes: [
                { to: 'elevator/A1', hitbox: [.35, .66, .17, .88] },
                { to: 'C1', hitbox: [.28, .31, .48, .52] }]},
            'C2': { left: 'C1', right: 'C3' },  
            'C3': { left: 'C2', right: 'C4', 
                forward: () => {  playSound('grandDown'); playGif('grandDown', 'B3', 10 * 150)}},
            'C4': { left: 'C3', right: 'C1', boxes: [
                { to: 'C6', hitbox: [.4, .61, .25, .36] }]},
            'C5': { back: 'C1a' },
            'C6': { back: 'C4' },
            'D1': { left: 'D3', right: 'D2', boxes: [
                { to: 'F1', hitbox: [.4, .5, .35, .61]}]},
            'D2': { left: 'D1', right: 'D3', boxes: [
                { to: 'B2', hitbox: [.2, .5, .2, .8] },
                { to: 'B3', hitbox: [.5, .8, .2, .8] }]},
            'D3': { left: 'D2', right: 'D1', boxes: [
                { to: 'D4', hitbox: [.2, .31, .36 ,.48]}]},
            'D4': { back: 'D3' },
            'E1': { left: 'E3', right: 'E2', boxes: [
                { to: 'G1', hitbox: [.57, .73, .35, .62]}]},
            'E2': { left: 'E1', right: 'E3', boxes: [
                { to: 'E4', hitbox: [.4, .85, .8, 1] }]},
            'E3': { left: 'E2', right: 'E1', boxes: [
                { to: 'B3', hitbox: [.2, .5, .2, .8] },
                { to: 'B4', hitbox: [.5, .8, .2, .8] }]},
            'E4': { back: 'E2'},
            'F1': { left: 'F2', right: 'F2',
                forward: () => { s.floor = 2;
                    playGif('stairsBottomUp', 'stairs/C1', 13 * 150, () => 
                        { playGif('stairsMiddleUp1', 'stairs/A1', 9 * 150 )})}},
            'F2': { left: 'F1', right: 'F1', forward: 'D2' },
            'G1': { left: 'G2', right: 'G2', forward: 'H1' },
            'G2': { left: 'G1', right: 'G1', forward: 'E3', back: 'H3' },
            'H1': { left: 'H4', right: 'H2', boxes: [
                { to: 'I1', hitbox: [.35, .48, .23, .55] }]},
            'H2': { left: 'H1', right: 'H3', boxes: [
                { to: 'pool/A1', hitbox: [.25, .48, .23, .73] } ]},
            'H3': { left: 'H2', right: 'H4', boxes: [
                { to: 'G2', hitbox: [.25, .5, .2, .6] }]},
            'H4': { left: 'H3', right: 'H1', boxes: [
                { to: 'H4a', hitbox: [.55, .7, .4, .63] }]},
            'H4a': { left: 'H3', right: 'H1', boxes: [
                { to: 'cafe/A4', hitbox: [.4, .85, .2, .8]}]},
            'I1': { left: 'I4', right: 'I2', boxes: [
                { to: 'I5', hitbox: [.57, .8, .53, .68] }]},
            'I2': { left: 'I1', right: 'I3'},
            'I3': { left: 'I2', right: 'I4', forward: 'H3' },
            'I4': { left: 'I3', right: 'I1' },
            'I5': { back: 'I1' }
        },
        'pool': { //zpool
            'A1': { left: 'A4', right: 'A2', forward: 'A5' },
            'A2': { left: 'A1', right: 'A3', boxes: [
                { to: 'A6', hitbox: [.54, .65, .3, .51] }]},
            'A2a':{ left: 'A1', right: 'A3', boxes: [
                { to: 'B2', hitbox: [.54, .65, .3, .51] }]},
            'A3': { left: 'A2', right: 'A4', forward: 'lobby/H4' },
            'A4': { left: 'A3', right: 'A1', boxes: [
                { to: 'A7', hitbox: [.37, .65, .35, .75] }]},
            'A5': { back: 'A1'},
            'A6': { forward: 'A2a'},
            'A7': { back: 'A4'},
            'B1': { left: 'B4', right: 'B2' },
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { playGif('ladderUp', 'C2', 10 * 150) }},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'C1': { left: 'C4', right: 'C2', boxes: [
                { to: 'C5', hitbox: [.48,.6,.22,.3] }]},
            'C2': { left: 'C1', right: 'C3' },
            'C3': { left: 'C2', right: 'C4', forward: 'C5' },
            'C4': { left: 'C3', right: 'C1',
                forward: () => { playGif('ladderDown', 'B4', 10 * 150) }},
            'C5': { back: 'C1' },
            'C6': { back: 'C3' }
        },
        'stairs': { //zstairs
            'A1': { left: 'A4', right: 'A2', 
                forward: () => { 
                    s.floor++; 
                    playGif('stairsMiddleUp2', 'C1', 9 * 150, () => { 
                        if (s.floor === 10) { playGif('stairsTopUp', 'B1', 10 * 150) }
                        else { playGif('stairsMiddleUp1', 'A1', 9 * 150) }})}},
            'A2': { left: 'A1', right: 'A3', forward: () => { 
                s.hallDirection = 1; s.hallPosition = 2; return 'hall/A7' }},
            'A3': { left: 'A2', right: 'A4', 
                forward: () => { 
                    s.floor--
                    playGif('stairsMiddleDown2', 'C1', 9 * 150, () => { 
                        if (s.floor === 1) { playGif('stairsBottomDown', 'lobby/F2', 9 * 150) } 
                        else { playGif('stairsMiddleDown1', 'A3', 10 * 150) }})}},
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3'},
            'B3': { left: 'B2', right: 'B4',
                forward: () => {
                    s.floor--
                    playGif('stairsTopDown', 'C1', 9 * 150, () => {
                        playGif('stairsMiddleDown1', 'A3', 10 * 150) })}},
            'B4': { left: 'B3', right: 'B1' },
            'B5': { back: 'B1', boxes: [
                { to: () => { playSound('drawer'); return 'B5a' }, hitbox: [.37, .52, .63, .78]}]},
            'B5a':{ back: 'B1' },
            'C1': {}
        },
        'plumbingroom': { //plumbing
            'A1': { left: 'A4', right: 'A2' },
            'A2': { left: 'A1', right: 'A3', forward: 'B2'},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1', boxes: 
                [{ to: 'A5', hitbox: [.1, .3, .08, .9]}]},
            'A5': { forward: 'cafe/A3', back: 'A4' },
            'B1': { left: 'B4', right: 'B2', boxes: [
                { to: 'B5', hitbox: [.28, .5, .5, .65] }]},
            'B2': { left: 'B1', right: 'B3' },
            'B3': { left: 'B2', right: 'B4', boxes: [
                { to: 'B6', hitbox: [.15,.4,.2,.35] }]},
            'B4': { left: 'B3', right: 'B1', forward: 'A4'},
            'B5': { back: 'B1' },
            'B6': { back: 'B3' }
        },
        'room': { //zroom
            'A1': { left: 'A4', right: 'A2', forward: 'A1a' },
            'A1a':{ left: 'A4', right: 'A2', forward: 'D1' },
            'A2': { left: 'A1', right: 'A3', forward: 'B2' },
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1', forward: () => { 
                s.hallDirection = 3; s.hallPosition = 7; return 'hall/A5' }},
            'B1': { left: 'B4', right: 'B2', forward: 'C1' },
            'B2': { left: 'B1', right: 'B3', boxes: [
                { to: 'B5', hitbox: [.2, .37, .7, .9] },
                { to: 'B6', hitbox: [.43, .57, .57, .73] },
                { to: 'B7', hitbox: [.55, .63, .35, .46] },
                { to: 'B8', hitbox: [.6, .64, .18, .25] }]},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'B5': { back: 'B2', forward: 'B5a' },
            'B5a':{ back: 'B2', forward: 'B5' },
            'B6':{ back: 'B2' },
            'B7': { back: 'B2' },
            'B8': { back: 'B2', forward: 'B8a'},
            'B8a':{ back: 'B2', forward: 'B8'},
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3', forward: 'C5' },
            'C3': { left: 'C2', right: 'C4', forward: 'B3' },
            'C4': { left: 'C3', right: 'C1', boxes: [
                { to: 'C6', hitbox: [.41, .57, .71, .93] }]},
            'C5': { back: 'C2'},
            'C6': { back: 'C4' },
            'D1': { left: 'D4', right: 'D2', forward: 'D5' },
            'D2': { left: 'D1', right: 'D3' },
            'D3': { left: 'D2', right: 'D4', forward: 'D3a' },
            'D3a': { left: 'D2', right: 'D4', forward: 'A3' },
            'D4': { left: 'D3', right: 'D1'},
            'D5': { back: 'D1' }
        },
        'top': {
            'A1': { left: 'A4', right: 'A2', boxes: [
                { to: () => { playSound('elevatorDoor'); return 'A1a'}, hitbox: [.28, .31, .48, .52]}
            ] },
            'A1a':{ left: 'A4', right: 'A2', boxes: [
                { to: () => { playSound('elevatorDoor'); return 'A1'}, hitbox: [.28, .31, .48, .52]},
                { to: 'elevator/A1', hitbox: [.35, .66, .17, .88]}]},
            'A2': { left: 'A1', right: 'A3' },
            'A3': { left: 'A2', right: 'A4', forward: 'B2' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B2', right: 'B2', forward: 'A1' },
            'B2': { left: 'B1', right: 'B1', forward: 'C2' },
            'C1': { left: 'C2', right: 'C2', forward: 'B1' },
            'C2': { left: 'C1', right: 'C1', boxes: [
                { to: 'C3', hitbox: [.6, .65, .51, .63] }]},
            'C2a':{ left: 'C1', right: 'C1', boxes: [
                { to: 'D3', hitbox: [.35, .65, .22, .82] }]},
            'C3': { forward: 'C2a' },    
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

// TODO: store variants as separate var? some level of indirection beyond frame and image.

// State
const s = {
    hallPosition: 0,
    hallDirection: 0,
    floor: 1,
    elevatorFloor: 1,
    plumbingDoorOpen: false,
    clockDoorOpen: false
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
    s.elevatorFloor = floor
    s.floor = floor
    let newFrame = s.elevatorFloor === 1? 'A2a' : (s.elevatorFloor === 10 ? 'A2c' : 'A2b')
    if (frame != newFrame) {
        transition(newFrame, 'fade')
    }
}