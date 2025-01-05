const gameData = {
    title: "Bush St",
    startRoom: 'A',
    startFrame: 101,
    extension: 'jpg',
    frameWidth: 840,
    frameHeight: 750,
    rooms: {
        A: {
            //100: { left: 103, right: 102, forward: 101 },
            101: { left: 103, right: 102, forward: 1 },
            102: { left: 101 },
            103: { right: 101 },
            1: { left: 4, right: 2, forward: 9 },
            2: { left: 1, right: 3, forward: 6 },
            3: { left: 2, right: 4 },
            4: { left: 3, right: 1, forward: 24 },
            5: { left: 8, right: 6 },
            6: { left: 5, right: 7 },
            7: { left: 6, right: 8 },
            8: { left: 7, right: 5, forward: 4 },
            9: { left: 12, right: 10 },
            10:{ left: 9, right: 11, forward: 18 },
            11:{ left: 10, right: 12, forward: 3 },
            12:{ left: 11, right: 9, forward: 16 },
            13:{ left: 16, right: 14 },
            14:{ left: 13, right: 15, forward: 10 },
            15:{ left: 14, right: 16 },
            16:{ left: 15, right: 13 },
            17:{ left: 20, right: 18 },
            18:{ left: 17, right: 19 },
            19:{ left: 18, right: 20 },
            20:{ left: 19, right: 17, forward: 12 },
            21:{ left: 24, right: 22 },
            22:{ left: 21, right: 23, forward: 2 },
            23:{ left: 22, right: 24 },
            24:{ left: 23, right: 21 }
        }
    }
}

const s = {}