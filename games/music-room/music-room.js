const config = {
    title: 'Music Room',
    customCursors: false,
    extension: 'jpeg',
    width: 640,
    height: 480,
    baseBox: { cursor: 'F' }
}

const s = {
    room: 'room',
    frame: 'B1',
}

const gameData = {
    'room': {
        'A1': { left: 'A4', right: 'A2' },
        'A2': { left: 'A1', right: 'A3', forward: 'B2' },
        'A3': { left: 'A2', right: 'A4' },
        'A4': { left: 'A3', right: 'A1' },
        'B1': { left: 'B4', right: 'B2', forward: 'C1' },
        'B2': { left: 'B1', right: 'B3' },
        'B3': { left: 'B2', right: 'B4' },
        'B4': { left: 'B3', right: 'B1', forward: 'A4' },
        'C1': { left: 'C4', right: 'C2', forward: 'E1', boxes: [
            { xy: [.6, .9, .7, 1], to: 'G1', cursor: 'F' }
        ]},
        'C2': { left: 'C1', right: 'C3', forward: 'D2'},
        'C3': { left: 'C2', right: 'C4', forward: 'B3' },
        'C4': { left: 'C3', right: 'C1' },
        'D1': { left: 'D4', right: 'D2', forward: 'C1' },
        'D2': { left: 'D1', right: 'D3' },
        'D3': { left: 'D2', right: 'D4', forward: 'C3' },
        'D4': { left: 'D3', right: 'D1', forward: 'C4' },
        'E1': { left: 'E4', right: 'E2' },
        'E2': { left: 'E1', right: 'E3' },
        'E3': { left: 'E2', right: 'E4', forward: 'C3' },
        'E4': { left: 'E3', right: 'E1', forward: 'F4' },
        'F1': { left: 'F4', right: 'F2' },
        'F2': { left: 'F1', right: 'F3', forward: 'E2' },
        'F3': { left: 'F2', right: 'F4' },
        'F4': { left: 'F3', right: 'F1' },
        'G1': { back: 'C1', boxes: [
            { xy: [0, .5, .45, 1], cursor: 'F', to: 'G2' },
            { xy: [.5, .8, .45, .85], cursor: 'F', to: 'G3' }
        ]},
        'G2': { back: 'G1', right: 'G3' },
        'G3': { back: 'G1', left: 'G1', forward: 'G6', boxes: [ { xy: [.2, .25, .5, .65], cursor: 'F', to: 'G4' }]},
        'G4': { back: 'G1', forward: 'G5', boxes: [ { xy: [.15, .25, .55, .7], cursor: 'F', to: 'G3' }]},
        'G5': { back: 'G4'},
        'G6': { back: 'G3'}
    }
}
