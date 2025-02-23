const gameData = {
    title: "Summit Ave",
    startRoom: 'A',
    startFrame: 'A1',
    extension: 'jpeg',
    frameWidth: 1000,
    frameHeight: 750,
    rooms: {
        'A': {
            'A1': { left: 'A4', right: 'A2' },
            'A2': { left: 'A1', right: 'A3' },
            'A3': { left: 'A2', right: 'A4' },
            'A4': { left: 'A3', right: 'A1' },
            'B1': { left: 'B4', right: 'B2' },
            'B2': { left: 'B1', right: 'B3' },
            'B3': { left: 'B2', right: 'B4' },
            'B4': { left: 'B3', right: 'B1' },
            'C1': { left: 'C4', right: 'C2' },
            'C2': { left: 'C1', right: 'C3' },
            'C3': { left: 'C2', right: 'C4' },
            'C4': { left: 'C3', right: 'C1' },
            'D1': { left: 'D4', right: 'D2' },
            'D2': { left: 'D1', right: 'D3' },
            'D3': { left: 'D2', right: 'D4' },
            'D4': { left: 'D3', right: 'D1' },
            'E1': { left: 'E4', right: 'E2' },
            'E2': { left: 'E1', right: 'E3' },
            'E3': { left: 'E2', right: 'E4' },
            'E4': { left: 'E3', right: 'E1' },
            'F1': { left: 'F4', right: 'F2' },
            'F2': { left: 'F1', right: 'F3' },
            'F3': { left: 'F2', right: 'F4' },
            'F4': { left: 'F3', right: 'F1' },
            'G1': { left: 'G4', right: 'G2' },
            'G2': { left: 'G1', right: 'G3' },
            'G3': { left: 'G2', right: 'G4' },
            'G4': { left: 'G3', right: 'G1' },
            'H1': { left: 'H4', right: 'H2' },
            'H2': { left: 'H1', right: 'H3' },
            'H3': { left: 'H2', right: 'H4' },
            'H4': { left: 'H3', right: 'H1' },
            'I1': { left: 'I4', right: 'I2' },
            'I2': { left: 'I1', right: 'I3' },
            'I3': { left: 'I2', right: 'I4' },
            'I4': { left: 'I3', right: 'I1' },
            'J1': { left: 'J4', right: 'J2' },
            'J2': { left: 'J1', right: 'J3' },
            'J3': { left: 'J2', right: 'J4' },
            'J4': { left: 'J3', right: 'J1' },
            'K1': { left: 'K4', right: 'K2' },
            'K2': { left: 'K1', right: 'K3' },
            'K3': { left: 'K2', right: 'K4' },
            'K4': { left: 'K3', right: 'K1' },
            'L1': { left: 'L4', right: 'L2' },
            'L2': { left: 'L1', right: 'L3' },
            'L3': { left: 'L2', right: 'L4' },
            'L4': { left: 'L3', right: 'L1' },
            'M1': { left: 'M4', right: 'M2' },
            'M2': { left: 'M1', right: 'M3' },
            'M3': { left: 'M2', right: 'M4' },
            'M4': { left: 'M3', right: 'M1' },
            'N1': { left: 'N4', right: 'N2' },
            'N2': { left: 'N1', right: 'N3' },
            'N3': { left: 'N2', right: 'N4' },
            'N4': { left: 'N3', right: 'N1' },
            'O1': { left: 'O4', right: 'O2' },
            'O2': { left: 'O1', right: 'O3' },
            'O3': { left: 'O2', right: 'O4' },
            'O4': { left: 'O3', right: 'O1' },
            'P1': { left: 'P4', right: 'P2' },
            'P2': { left: 'P1', right: 'P3' },
            'P3': { left: 'P2', right: 'P4' },
            'P4': { left: 'P3', right: 'P1' },
            'Q1': { left: 'Q4', right: 'Q2' },
            'Q2': { left: 'Q1', right: 'Q3' },
            'Q3': { left: 'Q2', right: 'Q4' },
            'Q4': { left: 'Q3', right: 'Q1' },
            'R1': { left: 'R4', right: 'R2' },
            'R2': { left: 'R1', right: 'R3' },
            'R3': { left: 'R2', right: 'R4' },
            'R4': { left: 'R3', right: 'R1' },
            'S1': { left: 'S4', right: 'S2' },
            'S2': { left: 'S1', right: 'S3' },
            'S3': { left: 'S2', right: 'S4' },
            'S4': { left: 'S3', right: 'S1' },
            'T1': { left: 'T4', right: 'T2' },
            'T2': { left: 'T1', right: 'T3' },
            'T3': { left: 'T2', right: 'T4' },
            'T4': { left: 'T3', right: 'T1' },
            'U1': { left: 'U4', right: 'U2' },
            'U2': { left: 'U1', right: 'U3' },
            'U3': { left: 'U2', right: 'U4' },
            'U4': { left: 'U3', right: 'U1' },
            'V1': { left: 'V4', right: 'V2' },
            'V2': { left: 'V1', right: 'V3' },
            'V3': { left: 'V2', right: 'V4' },
            'V4': { left: 'V3', right: 'V1' },
            'W1': { left: 'W4', right: 'W2' },
            'W2': { left: 'W1', right: 'W3' },
            'W3': { left: 'W2', right: 'W4' },
            'W4': { left: 'W3', right: 'W1' },
            'X1': { left: 'X4', right: 'X2' },
            'X2': { left: 'X1', right: 'X3' },
            'X3': { left: 'X2', right: 'X4' },
            'X4': { left: 'X3', right: 'X1' },
            'Y1': { left: 'Y4', right: 'Y2' },
            'Y2': { left: 'Y1', right: 'Y3' },
            'Y3': { left: 'Y2', right: 'Y4' },
            'Y4': { left: 'Y3', right: 'Y1' },
            'Z1': { left: 'Z4', right: 'Z2' },
            'Z2': { left: 'Z1', right: 'Z3' },
            'Z3': { left: 'Z2', right: 'Z4' },
            'Z4': { left: 'Z3', right: 'Z1' }
        },
    }
}

const s = {}