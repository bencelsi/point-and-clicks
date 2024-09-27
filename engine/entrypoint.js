// hacky solution to get around js module / CORS shenanigans locally

// find the game folder, "game" if none provided
let gameName = window.location.search === "" ? "game" : window.location.search.substring(1).split('&')[0]

const GAME_FOLDER = "../games/" + gameName

function wait(duration, then) {
	setTimeout(() => { then() }, duration)
}

// first, load the game data
// then, load the engine which wil run the game
addScript(GAME_FOLDER + "/game.js", 
    () => { addScript("engine.js") })

function addScript(src, onload=null) {
    console.log(src)
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    if (onload != null) { script.onload = onload }
    document.head.appendChild(script);
}