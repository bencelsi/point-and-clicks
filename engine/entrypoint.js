// hacky solution to get around js module / CORS shenanigans locally

// find the game folder, "game" if none provided
let gameFolder = window.location.search === "" ? "game" : window.location.search.substring(1)

// first, load game data
addScript("../" + gameFolder + "/data.js")

// next, load engine JS which wil run the game
addScript("engine.js")

function addScript(src) {
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    document.head.appendChild(script);
}