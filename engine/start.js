// Transition Types:
const LEFT = 	'left'
const RIGHT = 	'right'
const FADE = 	'fade'
const NONE = 	'none'

// hacky solution to get around js module / CORS shenanigans locally
const GAME_NAME = new URLSearchParams(window.location.search).get('game');
var FILE_NAME = new URLSearchParams(window.location.search).get('file');
if (FILE_NAME == null) FILE_NAME = GAME_NAME
const GAME_PATH = "../games/" + GAME_NAME

// first, load the game data
addScript(GAME_PATH + "/" + FILE_NAME + ".js")
addStyle(GAME_PATH + "/" + GAME_NAME + ".css")

// then, load the engine which wil run the game
addScript("baseConfig.js")
addScript("engine.js")

function addScript(src) {
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    document.head.appendChild(script);
}

function addStyle(fileName) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
    document.head.appendChild(link);
}

// shared functions

function wait(duration, then) { return setTimeout(() => { then() }, duration * 1000) }