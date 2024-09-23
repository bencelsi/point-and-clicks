const gameData = {
    title: "Griven",
    startRoom: 'hall',
    startFrame: 'A1',
    extension: 'png',
    frameWidth: 1000,
    frameHeight: 750,
    // customCursors: true,
    frames: {
        'lobby' : {
            'A1': { left: 'A4', right: 'A2', forward: 'B1' },
            'A2': { left: 'A1', right: 'A3' },
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2', forward: ()=> 
                { transition('C1', 'fade'); playGif('grandUp', 9, 100); return 'C1'}},
            'B2': { left: 'B1', right: 'B3', forward: 'E1' },
            'B3': { left: 'B2', right: 'B4', forward: 'A3' },
            'B4': { left: 'B3', right: 'B1', forward: 'D1' },
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3' },
            'C3': { left: 'C2', right: 'C4', forward: 'B3' },
            'C4': { left: 'C3', right: 'C1',
                boxes: [
                    {   hitbox: [.4, .61, .25, .36],
                        cursor: 'forward',
                        onclick: () => { transition('C6', 'fade') }
                    }]},
            'C6': { back: 'C4'},
            'D1': { left: 'D3', right: 'D2', forward: 'F1' },
            'D2': { left: 'D1', right: 'D3', forward: 'B2' },
            'D3': { left: 'D2', right: 'D1' },
            'E1': { left: 'E3', right: 'E2', forward: 'G1' },
            'E2': { left: 'E1', right: 'E3' },
            'E3': { left: 'E2', right: 'E1', forward: 'B4' },
            'F1': { left: 'F2', right: 'F2' },
            'F2': { left: 'F1', right: 'F2', forward: 'D2' },
            'G1': { left: 'G2', right: 'G2', forward: 'H1' },
            'G2': { left: 'G1', right: 'G1', forward: 'E3' },
            'H1': { left: 'H4', right: 'H2', forward: 'I1' },
            'H2': { left: 'H1', right: 'H3', forward: () => {setRoom('pool'); return 'A1'} },
            'H3': { left: 'H2', right: 'H4', forward: 'G2' },
            'H4': { left: 'H3', right: 'H1', forward: 'H5' },
            'H5': { left: 'H3', right: 'H1', forward: () => {setRoom('cafe'); return 'A4'}},
            'I1': { left: 'I4', right: 'I2' },
            'I2': { left: 'I1', right: 'I3'},
            'I3': { left: 'I2', right: 'I4', forward: 'H3' },
            'I4': { left: 'I3', right: 'I1' }
        },
        'pool': {
            'A1': { left: 'A4', right: 'A2', forward: 'A5' },
            'A2': { left: 'A1', right: 'A3', forward: 'A2-a'},
            'A2-a': { left: 'A1', right: 'A3', forward: 'B2'},
            'A3': { left: 'A2', right: 'A4', forward: 'H4' },
            'A4': { left: 'A3', right: 'A1', forward: 'A7' },
            'A5': { back: 'A1'},
            'A7': { back: 'A4'},
            'B1': { left: 'B4', right: 'B2'},
            'B2': { left: 'B1', right: 'B3', forward: 'C2'},
            'B3': { left: 'B2', right: 'B4'},
            'B4': { left: 'B3', right: 'B1', forward: 'A4'},
            'C1': { left: 'C4', right: 'C2'},
            'C2': { left: 'C1', right: 'C3', forward: 'C2'},
            'C3': { left: 'C2', right: 'C4', forward: 'C5'},
            'C4': { left: 'C3', right: 'C1', forward: 'B4'},
            'C5': { back: 'C3' }
        },
        'cafe': {
            'A1': { left: 'A4', right: 'A2', forward: 'C1' },
            'A2': { left: 'A1', right: 'A3', forward: () => {setRoom('lobby'); return 'H2'}},
            'A3': { left: 'A2', right: 'A4', forward: 'H4' },
            'A4': { left: 'A3', right: 'A1', forward: 'B4' },
            'B1': { left: 'B4', right: 'B2' },
            'B2': { left: 'B1', right: 'B3', forward: 'A2'},
            'B3': { left: 'B2', right: 'B4', forward: 'H4' },
            'B4': { left: 'B3', right: 'B1', forward: 'B4' },
            'C1': { left: 'C2', right: 'C2', forward: 'D1' },
            'C2': { left: 'C1', right: 'C1', forward: 'A3', back: 'D2' },
            'D1': { left: 'D4', right: 'D2' },
            'D2': { left: 'D1', right: 'D3', forward: 'E2'},
            'D3': { left: 'D2', right: 'D4' },
            'D4': { left: 'D3', right: 'D1', forward: 'C2' },
            'D1': { left: 'D4', right: 'D2' },
            'D2': { left: 'D1', right: 'D3', forward: 'E2'},
            'D3': { left: 'D2', right: 'D4' },
            'D4': { left: 'D3', right: 'D1', forward: 'C2' },
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
                forward: () => { hallMoveForward(); return 'A3'}
            },
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
                left: () => { 
                    console.log('d ' + s.hallDirection)
                    console.log('p ' + s.hallPosition)
                    hallTurnLeft();
                    console.log('d ' + s.hallDirection)
                    console.log('p ' + s.hallPosition)
                    switch (s.hallPosition % 4) {
                        case 0: return s.hallDirection === 0 ? 'A1' : 'A4'
                        case 1: return s.hallDirection === 0 ? 'A2' : 'A3'
                        case 3: return s.hallDirection === 0 ? 'A4' : 'A1'
                        default: alert('no!')
                    }},
                right: () => { 
                    console.log('d ' + s.hallDirection)
                    console.log('p ' + s.hallPosition)
                    hallTurnRight(); 
                    console.log('d ' + s.hallDirection)
                    console.log('p ' + s.hallPosition)
                    switch (s.hallPosition % 4) {
                        case 0: return s.hallDirection == 0 ? 'A1' : 'A4'
                        case 1: return s.hallDirection == 0 ? 'A2' : 'A3'
                        case 3: return s.hallDirection == 0 ? 'A4' : 'A1'
                        default: alert('no!')
                    }}
            },
            'A6': {
                left: () => { hallTurnLeft(); return 'A2' },
                right: () => { hallTurnRight(); return 'A3' }
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
            'B1': { left: 'B4', right: 'B2' },
            'B2': { left: 'B1', right: 'B3', 
                forward: () => { s.hallDirection = 1; s.hallPosition = 6; return 'A9'}},
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1',
                forward: () => { s.hallDirection = 3; s.hallPosition = 2; return 'A6'}},

        },
        'room': {
            'A1': { left: 'A4', right: 'A2', forward: 'A1a' },
            'A1a': { left: 'A4', right: 'A2', forward: 'D1' },
            'A2': { left: 'A1', right: 'A3', forward: 'B2' },
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2', forward: 'C1' },
            'B2': { left: 'B1', right: 'B3' },
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1', forward: 'A4' },
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3'},
            'C3': { left: 'C2', right: 'C4', forward: 'B3' },
            'C4': { left: 'C3', right: 'C1' },
            'D1': { left: 'D4', right: 'D2', forward: 'D5' },
            'D2': { left: 'D1', right: 'D3' },
            'D3': { left: 'D2', right: 'D4', forward: 'D3a' },
            'D3a': { left: 'D2', right: 'D4', forward: 'A3' },
            'D4': { left: 'D3', right: 'D1'},
            'D5': { back: 'D1' }
        },
        'elevator': {

        },
        'top': {
            'A1': { left: 'A4', right: 'A2', forward: 'A1a' },
            'A1a':{ left: 'A4', right: 'A2'},
            'A2': { left: 'A1', right: 'A3' },
            'A3': { left: 'A2', right: 'A4', forward: 'B2' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B2', right: 'B2', forward: 'A1' },
            'B2': { left: 'B1', right: 'B1', forward: 'C2' },
            'C1': { left: 'C2', right: 'C2', forward: 'B1' },
            'C2': { left: 'C1', right: 'C1', forward: 'C2a' },
            'C2a':{ left: 'C1', right: 'C1', forward: 'D3' },
            'D1': { left: 'D4', right: 'D2' },
            'D2': { left: 'D1', right: 'D3' },
            'D3': { left: 'D2', right: 'D4' },
            'D4': { left: 'D3', right: 'D1' }
        },

    }
}

// State
const s = {
    hallPosition: 0,
    hallDirection: 0,
    floor: 2
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