const gameData = {
    title: "Griven",
    startRoom: 'lobby',
    startFrame: '0a',
    extension: 'png',
    frames: {
        'lobby' : {
            '0a': { left: '0d', right: '0b', forward: '1a' },
            '0b': { left: '0a', right: '0c' },
            '0c': { left: '0b', right: '0d' },
            '0d': { left: '0c', right: '0a' },

            '1a': { left: '1d', right: '1b', forward: '6a' },
            '1b': { left: '1a', right: '1c', forward: '3b' },
            '1c': { left: '1b', right: '1d', forward: '0c' },
            '1d': { left: '1c', right: '1a', forward: '2c' },

            '2a': { left: '2c', right: '2b', forward: '4a' },
            '2b': { left: '2a', right: '2c', forward: '1b' },
            '2c': { left: '2b', right: '2a' },

            '3a': { left: '3c', right: '3b', forward: '5a' },
            '3b': { left: '3a', right: '3c' },
            '3c': { left: '3b', right: '3a', forward: '1d' },

            '4a' : { left: '4b', right: '4b' },
            '4b' : { left: '4a', right: '4a', forward: '2b' },

            '5a' : { left: '5b', right: '5b', forward: '7a' },
            '5b' : { left: '5a', right: '5a', forward: '3c' },

            '6a': { left: '6d', right: '6b' },
            '6b': { left: '6a', right: '6c' },
            '6c': { left: '6b', right: '6d', forward: '1c' },
            '6d': { left: '6c', right: '6a' },
            
            '7a': { left: '7d', right: '7b', forward: '8a' },
            '7b': { left: '7a', right: '7c' },
            '7c': { left: '7b', right: '7d', forward: '5b' },
            '7d': { left: '7c', right: '7a' },

            '8a': { left: '8d', right: '8b' },
            '8b': { left: '8a', right: '8c' },
            '8c': { left: '8b', right: '8d', forward: '7c' },
            '8d': { left: '8c', right: '8a' }
            
        }
    }
}

const state = {}