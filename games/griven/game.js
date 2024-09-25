// TODOs: 
// fix cursors
// change pool image orientations
// add music
// better way to set room... like: forward: {'cafe' : 'A1'}... or just 'lobby-A1'

let elevatorButtons = [
    {   hitbox: [.81, .84, .06, .09],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(1)}
    },
    {   hitbox: [.88, .91, .06, .09],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(2)}
    },
    {   hitbox: [.81, .84, .16, .19],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(3)}
    },
    {   hitbox: [.88, .91, .16, .19],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(4)}
    },
    {   hitbox: [.81, .84, .27, .30],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(5)}
    },
    {   hitbox: [.88, .91, .27, .30],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(6)}
    },  
    {   hitbox: [.81, .84, .37, .4],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(7)}
    },
    {   hitbox: [.88, .91, .37, .4],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(8)}
    },
    {   hitbox: [.81, .84, .48, .51],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(9)}
    },
    {   hitbox: [.88, .91, .48, .51],
        cursor: 'forward',
        onclick: () => { setElevatorFloor(10)}
    },
]

const gameData = {
    title: "Griven",
    startRoom: 'room',
    startFrame: 'A1',
    extension: 'png',
    frameWidth: 1000,
    frameHeight: 750,
    // customCursors: true,
    frames: {
        'opening': {
            'A1': { forward: () => { playSound('opening'); transition('A2', 'fade'); playGif('opening', 41 * 100) }},
            'A2': { forward: () => { playSound('moonlight', 1, true); setRoom('lobby'); return 'A1' }}
        },
        'cafe': {
            'A1': { left: 'A4', right: 'A2', forward: 'A1a' },
            'A1a':{ left: 'A4', right: 'A2', forward: 'A5' },
            'A2': { left: 'A1', right: 'A3', forward: () => { setRoom('lobby'); return 'H2' }},
            'A3': { left: 'A2', right: 'A4', forward: 'H4' },
            'A4': { left: 'A3', right: 'A1', forward: 'B4' },
            'A5': { forward: () => { setRoom('plumbingroom'); return 'A1' }, back: 'A1a' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3', forward: 'A2' },
            'B3': { left: 'B2', right: 'B4', forward: 'H4' },
            'B4': { left: 'B3', right: 'B1', forward: 'B4' },
            'B5': { back: 'B1'}
        },
        'hall': {
            'A1': { 
                left: () => { hallTurnLeft(); return 'A5' },
                right: () => { hallTurnRight(); return 'A5' },
                forward: () => { hallMoveForward(); return 'A2'}
            },
            'A2': {
                left: () => {
                    hallTurnLeft(); 
                    switch(s.hallPosition) {
                        case 2: return 'A7'
                        case 6: return 'A9'
                        default: return 'A5' }},
                right: () => {
                    hallTurnRight(); 
                    switch(s.hallPosition) {
                        case 2: return 'A6'
                        case 6: return 'A8'
                        default: return 'A5' }},
                forward: () => { hallMoveForward(); return 'A3'}},
            'A3': {
                left: () => {
                    hallTurnLeft(); 
                    switch(s.hallPosition) {
                        case 2: return 'A6'
                        case 6: return 'A8'
                        default: return 'A5' }},
                right: () => { hallTurnRight(); 
                    switch(s.hallPosition) {
                        case 2: return 'A7'
                        case 6: return 'A9'
                        default: return 'A5' }},
                forward: () => { hallMoveForward(); return 'A4'}
            },
            'A4': {
                left: () => { hallTurnLeft(); return 'A5' },
                right: () => { hallTurnRight(); return 'A5' },
            },
            'A5': {
                left: () => { hallTurnLeft(); return hallTurnLogic() },
                right: () => { hallTurnRight(); return hallTurnLogic() },
                forward: 'A5a'
            },
            'A5a': {
                left: () => { hallTurnLeft(); return hallTurnLogic() },
                right: () => { hallTurnRight(); return hallTurnLogic() },
                forward: () => { setRoom('room'); return 'A2' }
            },
            'A6': {
                left: () => { hallTurnLeft(); return 'A2' },
                right: () => { hallTurnRight(); return 'A3' },
                forward: () => { setRoom('stairs'); return 'A4' }
            },
            'A7': {
                left: () => { hallTurnLeft(); return 'A3' },
                right: () => { hallTurnRight(); return 'A2' },
                forward: 'B2'
            },
            'A8': {
                left: () => { hallTurnLeft(); return 'A2'},
                right: () => { hallTurnRight(); return 'A3'},
                forward: 'B4'
            },
            'A9': {
                left: () => { hallTurnLeft(); return 'A3' },
                right: () => { hallTurnRight(); return 'A2' }
            },
            'B1': { left: 'B4', right: 'B2', forward: () => { return s.floor == s.elevatorFloor ? 'B1b' : 'B1a' }},
            'B1a': { left: 'B4', right: 'B2', forward: 'B5' },
            'B1b': { left: 'B4', right: 'B2', forward: () => { setRoom('elevator'); return 'A1' }},
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { s.hallDirection = 1; s.hallPosition = 6; return 'A9'}},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1',
                forward: () => { s.hallDirection = 3; s.hallPosition = 2; return 'A6'}},
            'B5': { back: 'B1a' }
        },
        'lobby' : {
            'A1': { left: 'A4', right: 'A2', forward: 'B1' },
            'A2': { left: 'A1', right: 'A3', forward: 'A5'},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'A5': { back: 'A2' },
            'B1': { left: 'B4', right: 'B2', 
                forward: () => { transition('C1', 'none'); playGif('grandUp', 10 * 150)},
                boxes: [
                    { to: 'F1', hitbox: [.15, .23, .4, .56] },
                    { to: 'G1', hitbox: [.84, .95, .4, .58]}]},
            'B2': { left: 'B1', right: 'B3', forward: 'E2' },
            'B3': { left: 'B2', right: 'B4', forward: 'A3' },
            'B4': { left: 'B3', right: 'B1', forward: 'D3' },
            'C1': { left: 'C4', right: 'C2', boxes: [
                { to: () => { return s.elevatorFloor === 1 ? 'C1b' : 'C1a' }, hitbox: [.28, .31, .48, .52] }]},
            'C1a':{ left: 'C4', right: 'C2', forward: 'C5' },
            'C1b':{ left: 'C4', right: 'C2', forward: () => { setRoom('elevator'); return 'A1' }},
            'C2': { left: 'C1', right: 'C3' },
            'C3': { left: 'C2', right: 'C4', 
                forward: () => { transition('B3', 'fade'); playGif('grandDown', 10 * 150); ; return 'B3' }},
            'C4': { left: 'C3', right: 'C1', boxes: 
                [{ to: 'C6', hitbox: [.4, .61, .25, .36] }]},
            'C5': { back: 'C1a' },
            'C6': { back: 'C4'},
            'D1': { left: 'D3', right: 'D2', forward: 'F1' },
            'D2': { left: 'D1', right: 'D3', boxes: [
                { to: 'B2', hitbox: [.2, .5, .2, .8] },
                { to: 'B3', hitbox: [.5, .8, .2, .8] }]},
            'D3': { left: 'D2', right: 'D1' },
            'E1': { left: 'E3', right: 'E2', forward: 'G1' },
            'E2': { left: 'E1', right: 'E3', boxes: [
                { to: 'E4', hitbox: [.4, .85, .8, 1] }
            ] },
            'E3': { left: 'E2', right: 'E1', boxes: [
                { to: 'B3', hitbox: [.2, .5, .2, .8] },
                { to: 'B4', hitbox: [.5, .8, .2, .8] }]},
            'E4': { back: 'E2'},
            'F1': { left: 'F2', right: 'F2', 
                forward: () => { setRoom('stairs'); transition('A1', 'none'); s.floor = 2;
                    playGif('stairsBottomUp', 13 * 150, () => { playGif('stairsMiddleUp1', 9 * 150)})}},
            'F2': { left: 'F1', right: 'F1', forward: 'D2' },
            'G1': { left: 'G2', right: 'G2', forward: 'H1' },
            'G2': { left: 'G1', right: 'G1', forward: 'E3' },
            'H1': { left: 'H4', right: 'H2', boxes: 
                [{ to: 'I1', hitbox: [.35, .48, .23, .55] }]},
            'H2': { left: 'H1', right: 'H3', forward: () => { setRoom('pool'); return 'A1'} },
            'H3': { left: 'H2', right: 'H4', boxes: 
                [{ to: 'G2', hitbox: [.25, .5, .2, .6] }]},
            'H4': { left: 'H3', right: 'H1', forward: 'H5' },
            'H5': { left: 'H3', right: 'H1', forward: () => { setRoom('cafe'); return 'A4'}},
            'I1': { left: 'I4', right: 'I2', boxes: 
                [{ to: 'I5', hitbox: [.57, .8, .53, .68] }]
            },
            'I2': { left: 'I1', right: 'I3'},
            'I3': { left: 'I2', right: 'I4', forward: 'H3' },
            'I4': { left: 'I3', right: 'I1' }
        },
        'pool': {
            'A1': { left: 'A4', right: 'A2', forward: 'A5' },
            'A2': { left: 'A1', right: 'A3', boxes: [
                { to: 'A2a', hitbox: [.54, .65, .3, .51] }]},
            'A2a':{ left: 'A1', right: 'A3', boxes: [
                { to: 'B2', hitbox: [.54, .65, .3, .51] }]},
            'A3': { left: 'A2', right: 'A4', forward: () => { setRoom('lobby'); return 'H4' }},
            'A4': { left: 'A3', right: 'A1', boxes: [
                { to: 'A7', hitbox: [.37, .65, .35, .75] }]},
            'A5': { back: 'A1'},
            'A7': { back: 'A4'},
            'B1': { left: 'B4', right: 'B2' },
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { transition('C2', 'fade');
                    playGif('ladderUp', 10 * 150, () => {  })}},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3' },
            'C3': { left: 'C2', right: 'C4', forward: 'C5' },
            'C4': { left: 'C3', right: 'C1',
                forward: () => { transition('B4', 'fade');
                    playGif('ladderDown', 10 * 150);}},
            'C5': { back: 'C3' }
        },
        'stairs': {
            'A1': { left: 'A4', right: 'A2', 
                forward: () => { 
                    s.floor++; 
                    if (s.floor === 10) {  transition('B1', 'fade') }
                    playGif('stairsMiddleUp2', 9 * 150, () => { 
                        if (s.floor === 10) { playGif('stairsTopUp', 10 * 150) }
                        else { playGif('stairsMiddleUp1', 9 * 150) }
                })}},
            'A2': { left: 'A1', right: 'A3', forward: () => { 
                s.hallDirection = 1; s.hallPosition = 2; setRoom('hall'); return 'A7'}},
            'A3': { left: 'A2', right: 'A4', 
                forward: () => { 
                    s.floor--
                    if (s.floor === 1) { setRoom('lobby'); transition('F2', 'fade') }
                    else { transition('A3', 'fade') }
                    playGif('stairsMiddleDown2', 9 * 150,  () => { 
                        if (s.floor === 1) { playGif('stairsBottomDown', 9 * 150) } 
                        else { playGif('stairsMiddleDown1', 10 * 150) }})}},
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3'},
            'B3': { left: 'B2', right: 'B4', forward: () => {
                s.floor--; transition('A3', 'fade');
                playGif('stairsTopDown', 9 * 150)
            }},
            'B4': { left: 'B3', right: 'B1'},
            'B5': { back: 'B1' }
        },
        'plumbingroom': {
            'A1': { left: 'A4', right: 'A2' },
            'A2': { left: 'A1', right: 'A3', forward: 'B2'},
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1', forward: 'A5' },
            'A5': { forward: () => { setRoom('cafe'); return 'A3' }, back: 'A4' },
            'B1': { left: 'B4', right: 'B2', forward: 'B5' },
            'B2': { left: 'B1', right: 'B3' },
            'B3': { left: 'B2', right: 'B4', forward: 'B6' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'B5': { back: 'B1' },
            'B6': { back: 'B3' }
        },
        'room': {
            'A1': { left: 'A4', right: 'A2', forward: 'A1a' },
            'A1a':{ left: 'A4', right: 'A2', forward: 'D1' },
            'A2': { left: 'A1', right: 'A3', forward: 'B2' },
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1', forward: () => { 
                setRoom('hall'); s.hallDirection = 3; s.hallPosition = 7; return 'A5' }},
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
        'elevator': {
            'A1': { 
                left: () => {
                    switch(s.elevatorFloor) { 
                        case 1: return 'A2a'
                        case 10: return 'A2c'
                        default: return 'A2b'
                }},
                right: () => { 
                    switch(s.elevatorFloor) { 
                        case 1: return 'A2a'
                        case 10: return 'A2c'
                        default: return 'A2b'
                }}},
            'A2a': { left: 'A1', right: 'A1',
                forward: () => { setRoom('lobby'); return 'C3' },
                boxes: elevatorButtons
            },
            'A2b': { left: 'A1', right: 'A1',
                forward: () => { setRoom('hall'); return 'B3' },
                boxes: elevatorButtons
            },
            'A2c': { left: 'A1', right: 'A1',
                forward: () => { setRoom('top'); return 'A3' },
                boxes: elevatorButtons
            },
        },
        'top': {
            'A1': { left: 'A4', right: 'A2', forward: 'A1a' },
            'A1a':{ left: 'A4', right: 'A2', forward: () => { setRoom('elevator'); return 'A1' }},
            'A2': { left: 'A1', right: 'A3' },
            'A3': { left: 'A2', right: 'A4', forward: 'B2' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B2', right: 'B2', forward: 'A1' },
            'B2': { left: 'B1', right: 'B1', forward: 'C2' },
            'C1': { left: 'C2', right: 'C2', forward: 'B1' },
            'C2': { left: 'C1', right: 'C1', forward: 'C2a' },
            'C2a':{ left: 'C1', right: 'C1', forward: 'D3' },
            'D1': { left: 'D4', right: 'D2', forward: 'C1' },
            'D2': { left: 'D1', right: 'D3', forward: 'D5' },
            'D3': { left: 'D2', right: 'D4', forward: 
                () => { playGif('exit', 13 * 150, 
                    () => { playGif('fall', 22 * 100) })}},
            'D4': { left: 'D3', right: 'D1' },
            'D5': { back: 'D2'}
        },
    }
}

// TODO: store variants as separate var? some level of indirection beyond frame and image.
// 



// State
const s = {
    hallPosition: 0,
    hallDirection: 0,
    floor: 1,
    elevatorFloor: 1
}

function hallTurnLeft() {
    s.hallDirection = s.hallDirection == 0 ? 3 : s.hallDirection - 1
}

function hallTurnRight() {
    s.hallDirection = s.hallDirection == 3 ? 0 : s.hallDirection + 1
}

function hallMoveForward() {
    s.hallPosition += (s.hallDirection === 0 ? 1 : -1)
}

function hallTurnLogic() {
    switch (s.hallPosition % 4) {
        case 0: return s.hallDirection == 0 ? 'A1' : 'A4'
        case 1: return s.hallDirection == 0 ? 'A2' : 'A3'
        case 3: return s.hallDirection == 0 ? 'A4' : 'A1'
    }
}

function setElevatorFloor(floor) {
    s.elevatorFloor = floor
    s.floor = floor
    let newFrame = getElevatorFrame()
    if (frame != newFrame) {
        transition(newFrame, 'fade')
    }
}
 function getElevatorFrame() {
    switch(s.elevatorFloor) { 
        case 1:  return 'A2a'
        case 10: return 'A2c'
        default: return 'A2b'
    }
 }
