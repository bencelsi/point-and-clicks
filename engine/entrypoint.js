// hacky solution to get around js module / CORS shenanigans locally

// find the game folder, "game" if none provided
let gameName = window.location.search === "" ? "game" : window.location.search.substring(1)
const GAME_FOLDER = "../games/" + gameName

// first, load game data
addScript(GAME_FOLDER + "/game.js")

// next, load engine JS which wil run the game
addScript("engine.js")

function addScript(src) {
    console.log(src)
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    document.head.appendChild(script);
}