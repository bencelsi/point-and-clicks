const config = {
    title: 'Key Finder',
    width: 640, height: 480,
    extension: 'png',
    boxCursor: 'O',
    defaultCursor: 'N',
	customCursors: true,
    waitCursor: null,
    defaultBox: { cursor: 'O' },
    style: '',
}

const s = { room: 'colors', frame: 'A1',
}

const inventory = {}

const gameData = {
	
    'colors': {

		'M1': {},


        'A1': { left: 'A4', right: 'A2', forward: 'B1' },
        'A2': { left: 'A1', right: 'A3', forward: 'D2' },
        'A3': { left: 'A2', right: 'A4' },
		'A4': { left: 'A3', right: 'A1' },

		'B1': { left: 'B4', right: 'B2' },
        'B2': { left: 'B1', right: 'B3', forward: 'C2' },
        'B3': { left: 'B2', right: 'B4', forward: 'A3' },
		'B4': { left: 'B3', right: 'B1' },

		'C1': { left: 'C4', right: 'C2' },
        'C2': { left: 'C1', right: 'C3' },
        'C3': { left: 'C2', right: 'C4', forward: 'D3' },
		'C4': { left: 'C3', right: 'C1', forward: 'B4' },

		'D1': { left: 'D4', right: 'D2', forward: 'C1' },
        'D2': { left: 'D1', right: 'D3' },
        'D3': { left: 'D2', right: 'D4', forward: 'F3' },
		'D4': { left: 'D3', right: 'D1' },

		'F1': { left: 'F4', right: 'F2', forward: 'D1' },
        'F2': { left: 'F1', right: 'F3' },
        'F3': { left: 'F2', right: 'F4', }, //forward: 'I3'
		'F4': { left: 'F3', right: 'F1', forward: 'G4' },

		'G1': { left: 'G4', right: 'G2' },
        'G2': { left: 'G1', right: 'G3', forward: 'F2' },
        'G3': { left: 'G2', right: 'G4', forward: 'G3a' },
		'G4': { left: 'G3', right: 'G1', forward: 'H4' },
		'G3a': { back: 'G3' },

		'H1': { left: 'H4', right: 'H2' },
        'H2': { left: 'H1', right: 'H3', forward: 'G2' },
        'H3': { left: 'H2', right: 'H4' },
		'H4': { left: 'H3', right: 'H1' },
		
		'I1': { left: 'I4', right: 'I2', forward: 'F1' },
        'I2': { left: 'I1', right: 'I3' },
        'I3': { left: 'I2', right: 'I4', forward: 'J3' },
		'I4': { left: 'I3', right: 'I1', forward: 'L4' },


		'J1': { left: 'J4', right: 'J2', forward: 'I1' },
        'J2': { left: 'J1', right: 'J3' },
        'J3': { left: 'J2', right: 'J4' },
		'J4': { left: 'J3', right: 'J1', forward: 'K4' },


		'K1': { left: 'K4', right: 'K2', forward: 'L1' },
        'K2': { left: 'K1', right: 'K3', forward: 'J2' },
        'K3': { left: 'K2', right: 'K4' },
		'K4': { left: 'K3', right: 'K1' },

		'L1': { left: 'L4', right: 'L2' },
        'L2': { left: 'L1', right: 'L3', forward: 'I2' },
        'L3': { left: 'L2', right: 'L4', forward: 'K3' },
		'L4': { left: 'L3', right: 'L1' },

    }
}
