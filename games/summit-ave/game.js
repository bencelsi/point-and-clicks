const gameData = {
    title: "Summit Ave",
    startRoom: 'light',
    startFrame: '1a',
    extension: 'jpeg',
    frameWidth: 1000,
    frameHeight: 750,
    rooms: {
        'light': {
            '1a': { forward: '1b' },
            '1b': { forward: '2a' },
            '2a': { left: '2d', right: '2b', forward: '3a' },
            '2b': { left: '2a', right: '2c' },
            '2c': { left: '2b', right: '2d' },
            '2d': { left: '2c', right: '2a' },
            '3a': { left: '3d', right: '3b', forward: '4a' },
            '3b': { left: '3a', right: '3c',},
            '3c': { left: '3b', right: '3d', forward: '2c' },
            '3d': { left: '3c', right: '3a' },
            '4a': { left: '4d', right: '4b', forward: '5a' },
            '4b': { left: '4a', right: '4c' },
            '4c': { left: '4b', right: '4d', forward: '3c' },
            '4d': { left: '4c', right: '4a' },
            '5a': { left: '5d', right: '5b', forward: '6a' },
            '5b': { left: '5a', right: '5c' },
            '5c': { left: '5b', right: '5d', forward: '4c' },
            '5d': { left: '5c', right: '5a', forward: '8d' },
            '6a': { left: '6d', right: '6b', forward: '7a' },
            '6b': { left: '6a', right: '6c' },
            '6c': { left: '6b', right: '6d', forward: '5c' },
            '6d': { left: '6c', right: '6a' },
            '7a': { left: '7d', right: '7b' },
            '7b': { left: '7a', right: '7c' },
            '7c': { left: '7b', right: '7d', forward: '6c'},
            '7d': { left: '7c', right: '7a' },
            '8a': { left: '8d', right: '8b' },
            '8b': { left: '8a', right: '8c', forward: '5b' },
            '8c': { left: '8b', right: '8d', forward: '18c' },
            '8d': { left: '8c', right: '8a', forward: '9e' },
            '9a': { left: '9e', right: '9b' },
            '9b': { left: '9a', right: '9c' },
            '9c': { left: '9b', right: '9d', forward: '8c' },
            '9d': { left: '9c', right: '9e' },
            '9e': { left: '9d', right: '9a', forward: '10d' },
            '10a': { left: '10d', right: '10b' },
            '10b': { left: '10a', right: '10c', forward: '9b' },
            '10c': { left: '10b', right: '10d', forward: '11c' },
            '10d': { left: '10c', right: '10a' },
            '11a': { left: '11d', right: '11b', forward: '10a' },
            '11b': { left: '11a', right: '11c' },
            '11c': { left: '11b', right: '11d' },
            '11d': { left: '11c', right: '11a', forward: '12d' },
            '12a': { left: '12d', right: '12b', forward: '15a' },
            '12b': { left: '12a', right: '12c', forward: '11b' },
            '12c': { left: '12b', right: '12d', forward: '13c' },
            '12d': { left: '12c', right: '12a', forward: 'dark/12d' },
            '13a': { left: '13d', right: '13b', forward: '12a' },
            '13b': { left: '13a', right: '13c' },
            '13c': { left: '13b', right: '13d', forward: '14c' },
            '13d': { left: '13c', right: '13a' },
            '14a': { left: '14d', right: '14b', forward: '13a' },
            '14b': { left: '14a', right: '14c' },
            '14c': { left: '14b', right: '14d' },
            '14d': { left: '14c', right: '14a' },
            '15a': { left: '15d', right: '15b' },
            '15b': { left: '15a', right: '15c' },
            '15c': { left: '15b', right: '15d', forward: '12c' },
            '15d': { left: '15c', right: '15a' },
            '16a': { left: '16d', right: '16b', forward: '18a' },
            '16b': { left: '16a', right: '16c' },
            '16c': { left: '16b', right: '16d', forward: '17c'},
            '16d': { left: '16c', right: '16a' },
            '17a': { left: '17d', right: '17b', forward: '16a' },
            '17b': { left: '17a', right: '17c' },
            '17c': { left: '17b', right: '17d' },
            '17d': { left: '17c', right: '17a' },
            '18a': { left: '18d', right: '18b', forward: '8a' },
            '18b': { left: '18a', right: '18c' },
            '18c': { left: '18b', right: '18d', forward: '16c' },
            '18d': { left: '18c', right: '18a', forward: '19d' },
            '19a': { left: '19d', right: '19b' },
            '19b': { left: '19a', right: '19c', forward: '18b' },
            '19c': { left: '19b', right: '19d', forward: '20c' },
            '19d': { left: '19c', right: '19a', forward: '21d'},
            '20a': { left: '20d', right: '20b', forward: '19a' },
            '20b': { left: '20a', right: '20c' },
            '20c': { left: '20b', right: '20d' },
            '20d': { left: '20c', right: '20a', },
            '21a': { left: '21d', right: '21b', },
            '21b': { left: '21a', right: '21c', forward: '19b' },
            '21c': { left: '21b', right: '21d' },
            '21d': { left: '21c', right: '21a' }
        },
        dark: {
            '2a': { left: '2d', right: '2b', forward: '3a' },
            '2b': { left: '2a', right: '2c' },
            '2c': { left: '2b', right: '2d' },
            '2d': { left: '2c', right: '2a' },
            '3a': { left: '3d', right: '3b', forward: '4a' },
            '3b': { left: '3a', right: '3c',},
            '3c': { left: '3b', right: '3d', forward: '2c' },
            '3d': { left: '3c', right: '3a' },
            '4a': { left: '4d', right: '4b', forward: '5a' },
            '4b': { left: '4a', right: '4c' },
            '4c': { left: '4b', right: '4d', forward: '3c' },
            '4d': { left: '4c', right: '4a' },
            '5a': { left: '5d', right: '5b', forward: '6a' },
            '5b': { left: '5a', right: '5c' },
            '5c': { left: '5b', right: '5d', forward: '4c' },
            '5d': { left: '5c', right: '5a', forward: '8d' },
            '6a': { left: '6d', right: '6b', forward: '7a' },
            '6b': { left: '6a', right: '6c' },
            '6c': { left: '6b', right: '6d', forward: '5c' },
            '6d': { left: '6c', right: '6a' },
            '7a': { left: '7d', right: '7b' },
            '7b': { left: '7a', right: '7c' },
            '7c': { left: '7b', right: '7d', forward: '6c'},
            '7d': { left: '7c', right: '7a' },
            '8a': { left: '8d', right: '8b' },
            '8b': { left: '8a', right: '8c', forward: '5b' },
            '8c': { left: '8b', right: '8d', forward: '18c' },
            '8d': { left: '8c', right: '8a', forward: '9e' },
            '9a': { left: '9e', right: '9b' },
            '9b': { left: '9a', right: '9c' },
            '9c': { left: '9b', right: '9d', forward: '8c' },
            '9d': { left: '9c', right: '9e' },
            '9e': { left: '9d', right: '9a', forward: '10d' },
            '10a': { left: '10d', right: '10b' },
            '10b': { left: '10a', right: '10c', forward: '9b' },
            '10c': { left: '10b', right: '10d', forward: '11c' },
            '10d': { left: '10c', right: '10a' },
            '11a': { left: '11d', right: '11b', forward: '10a' },
            '11b': { left: '11a', right: '11c' },
            '11c': { left: '11b', right: '11d' },
            '11d': { left: '11c', right: '11a', forward: '12d' },
            '12a': { left: '12d', right: '12b', forward: '15a' },
            '12b': { left: '12a', right: '12c', forward: '11b' },
            '12c': { left: '12b', right: '12d', forward: '13c' },
            '12d': { left: '12c', right: '12a', forward: 'light/12d' },
            '13a': { left: '13d', right: '13b', forward: '12a' },
            '13b': { left: '13a', right: '13c' },
            '13c': { left: '13b', right: '13d', forward: '14c' },
            '13d': { left: '13c', right: '13a' },
            '14a': { left: '14d', right: '14b', forward: '13a' },
            '14b': { left: '14a', right: '14c' },
            '14c': { left: '14b', right: '14d' },
            '14d': { left: '14c', right: '14a' },
            '15a': { left: '15d', right: '15b' },
            '15b': { left: '15a', right: '15c' },
            '15c': { left: '15b', right: '15d', forward: '12c' },
            '15d': { left: '15c', right: '15a' },
            '16a': { left: '16d', right: '16b', forward: '18a' },
            '16b': { left: '16a', right: '16c' },
            '16c': { left: '16b', right: '16d', forward: '17c'},
            '16d': { left: '16c', right: '16a' },
            '17a': { left: '17d', right: '17b', forward: '16a' },
            '17b': { left: '17a', right: '17c' },
            '17c': { left: '17b', right: '17d' },
            '17d': { left: '17c', right: '17a' },
            '18a': { left: '18d', right: '18b', forward: '8a' },
            '18b': { left: '18a', right: '18c' },
            '18c': { left: '18b', right: '18d', forward: '16c' },
            '18d': { left: '18c', right: '18a', forward: '19d' },
            '19a': { left: '19d', right: '19b' },
            '19b': { left: '19a', right: '19c', forward: '18b' },
            '19c': { left: '19b', right: '19d', forward: '20c' },
            '19d': { left: '19c', right: '19a', forward: '21d'},
            '20a': { left: '20d', right: '20b', forward: '19a' },
            '20b': { left: '20a', right: '20c' },
            '20c': { left: '20b', right: '20d' },
            '20d': { left: '20c', right: '20a', },
            '21a': { left: '21d', right: '21b', },
            '21b': { left: '21a', right: '21c', forward: '19b' },
            '21c': { left: '21b', right: '21d' },
            '21d': { left: '21c', right: '21a' }
        }
    }
}

const s = {}