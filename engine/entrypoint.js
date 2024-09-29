// hacky solution to get around js module / CORS shenanigans locally

// find the game folder
const GAME_FOLDER = "../games/" + window.location.search.substring(1).split('&')[0]

// first, load the game data
addScript(GAME_FOLDER + "/game.js")
// then, load the engine which wil run the game
addScript("engine.js")

function addScript(src) {
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    document.head.appendChild(script);
}

// shared functions
function wait(duration, then) {
	setTimeout(() => { then() }, duration)
}