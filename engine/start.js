// hacky solution to get around js module / CORS shenanigans locally

const GAME_NAME = window.location.search.substring(1).split('&')[0]
const GAME_PATH = "../games/" + GAME_NAME

// first, load the game data
addScript(GAME_PATH + "/" + GAME_NAME + ".js")

// then, load the engine which wil run the game
addScript("baseConfig.js")

addScript("engine.js")

function addScript(src) {
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    document.head.appendChild(script);
}

// shared functions
function wait(duration, then) { return setTimeout(() => { then() }, duration * 1000) }