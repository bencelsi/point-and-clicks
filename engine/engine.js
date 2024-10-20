// TODO: 'enqueue' a click for fast clickthru
// TODO: Add 'menu' logic, saveable state
// TODO: Make rooms optional
// TODO: how to cache when left/right returns fn? framesToCache, or... left: {to: 'A1', fn: ()=> {...}}
// TODO: cache pics/gifs

get("favicon").href = GAME_FOLDER + "/favicon.ico"
const FRAME_PATH = GAME_FOLDER + '/assets/frames/'
const GIF_PATH = GAME_FOLDER + '/assets/gifs/'
const SOUND_PATH = GAME_FOLDER + '/assets/sound/'
const MUSIC_PATH = SOUND_PATH + 'music/'
const PIC_PATH = GAME_FOLDER + '/assets/pics/'
const INVENTORY_PATH = PIC_PATH + '/inventory/'

let music = new Audio(); music.loop = true

// DOM globals:
let standardBoxesDiv, customBoxesDiv, picsDiv, cacheDiv, transitionsDiv, frameImg, inventoryDiv, cursorBlockDiv

// Constants:
let CURSOR_PATH, WIDTH, HEIGHT, SIDE_SPEED, FADE_SPEED

window.onload = waitForGameData()

// hacky way to wait for gameData & s (state) to load
function waitForGameData() {
	try { gameData; s; init() } 
	catch (e) { console.log(e); wait(.2, waitForGameData) }
}

function init() {
	document.title = location.hostname === "" ? "." + gameData.title : gameData.title

	//DOM elements:
	standardBoxesDiv = get('standardBoxes'); customBoxesDiv = get('customBoxes'); picsDiv = get('pics')
	cacheDiv = get('cache'); transitionsDiv = get('transitions'); frameImg = get('frame'); 
	inventoryDiv = get('inventory'); moviesDiv = get('movies'); cursorBlockDiv = get('cursorBlock')
	
	// global vars:
	room = gameData.startRoom; frame = gameData.startFrame; extension = gameData.extension

	// constants
	CURSOR_PATH = gameData.customCursors === true ? GAME_FOLDER + '/assets/cursors/' : 'assets/cursors/'
	WIDTH = gameData.frameWidth === undefined ? 750 : gameData.frameWidth
	HEIGHT = gameData.frameHeight === undefined ? 750 : gameData.frameHeight
	SIDE_SPEED = .35; FADE_SPEED = 1
	get("screen").style.width = WIDTH + "px"; get("screen").style.height = HEIGHT + "px"
	updateStyle(); setupStandardBoxes(); goTo(frame); refreshInventory(); setMusic(room)
	//window.onclick = launchFullScreen(get('window'))
}

const standardBoxes = {
	left: { xy: [0, .2, .2, .8], transition: 'left', cursor: 'left', id: 'left' },
	right: { xy: [.8, 1, .2, .8], transition: 'right', cursor: 'right', id: 'right' },
	forward: { xy: [.25, .75, .25, .75], transition: 'fade', cursor: 'forward', id: 'forward' },
	back: { xy: [0, 1, 0, .2], transition: 'fade', cursor: 'back', id: 'back' }
}

// DOM setup  ******************************************
function setupStandardBoxes() {
	for (let i in standardBoxes) { makeBox(standardBoxes[i], standardBoxesDiv) }
}


function updateStyle() { // TODO: better.
	get("style").innerHTML =  `
	@keyframes leftIn { from { transform: translateX(0) } to { transform: translateX(${WIDTH}px) }}
	@keyframes leftOut { from { transform: translateX(0) }}
	@keyframes rightIn { from { transform: translateX(0) } to { transform: translateX(-${WIDTH}px) }}
	@keyframes rightOut { from { transform: translateX(0) }}
	@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 }}
	@keyframes fadeOut { from { opacity: 1 }}
	.leftIn { animation:leftIn ${SIDE_SPEED}s }
	.leftOut { animation:leftOut ${SIDE_SPEED}s; transform: translateX(${WIDTH}px) }
	.rightIn { animation:rightIn ${SIDE_SPEED}s} 
	.rightOut { animation:rightOut ${SIDE_SPEED}s; transform: translateX(-${WIDTH}px) } 
	.fadeIn { animation:fadeIn ${FADE_SPEED}s; } 
	.fadeOut { animation:fadeOut ${FADE_SPEED}s; opacity: 0 }`
}

function setFade(fade) { FADE_SPEED = fade; updateStyle() }

// TRANSITIONS ******************************************
function goTo(newFrame, transitionType) {
	console.log(newFrame)
	if (newFrame == null) { return }
	if (transitionType != 'none') { createTransition(transitionType + 'Out') }
	[frame, newRoom, newExtension] = parseFrame(newFrame)
	if (newRoom != null) { room = newRoom; setMusic(newRoom) }
	let frameData = gameData.rooms[room][frame]
	if (frameData == null) { frameData = {} }
	let img
	if (frameData.alt != null && frameData.alt.if()) { img = frameData.alt.name } 
	else { img = frame + '.' + (newExtension == null ? extension : newExtension) }
	frameImg.src = FRAME_PATH + room + '/' + img
	
	refreshStandardBoxes(frameData)
	refreshCustomBoxes()
	if (transitionType != 'none') { createTransition(transitionType + 'In') }
	delay = transitionType === 'none' ? 0 : (transitionType === 'fade') ? FADE_SPEED : SIDE_SPEED
	 // if we wait full fade speed, it makes moving forward annoying. TODO: better.
	freeze()
	wait(delay, () => {
		console.log('fade done')
		transitionsDiv.innerHTML = ''
		cacheResources(frameData)
		if (frameData.onEntrance != null) { frameData.onEntrance() }
		unfreeze()
	})
}

function freeze() { cursorBlockDiv.style.visibility = 'visible' }

function unfreeze() { cursorBlockDiv.style.visibility = 'hidden' }

function createTransition(transitionType) {
	let transition = document.createElement('div')
	transition.appendChild(frameImg.cloneNode(true)) //creates duplicate img
	let picBoxes = picsDiv.cloneNode(true)
	picBoxes.id = null
	transition.appendChild(picBoxes)
	transition.classList.add('transition')
	transition.classList.add(transitionType)
	if (transitionType == 'leftIn') { transition.style.left = -WIDTH + 'px' } 
	else if (transitionType == 'rightIn') { transition.style.left = WIDTH + 'px' }
	transitionsDiv.appendChild(transition)
}

// BOXES ******************************************
function refresh() { refreshCustomBoxes(); refreshStandardBoxes(); refreshInventory() }

function refreshCustomBoxes() {
	picsDiv.innerHTML = ''; customBoxesDiv.innerHTML = ''
	let frameData = gameData.rooms[room][frame]
	if (frameData == null) { return }
	let boxes = frameData.boxes
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let boxData = boxes[i]
			makeCustomBox(boxData)
		}
	}
}


// returns a box element from a JSON object containing box info, or null if the box shouldn't exist
function makeCustomBox(boxData) {
	if (boxData.if !== undefined && !boxData.if()) { return }
	makeBox(boxData, customBoxesDiv)
	makePicBox(boxData)
}

function makeBox(boxData, div) {
	let xy = simpleEval(boxData.xy)
	if (boxData.xy == null) { return }

	let box = document.createElement('div')
	box.className = 'box'
	box.style.left = xy[0] * WIDTH + 'px'
	box.style.width = (xy[1] - xy[0]) * WIDTH + 'px'
	box.style.bottom = xy[2] * HEIGHT + 'px'
	box.style.height = (xy[3] - xy[2]) * HEIGHT + 'px'
	let cursor = orDefault(boxData.cursor, 'forward')
	setCursor(box, cursor)

	let fn = orDefault(boxData.fn, null, false)
	let to = orDefault(boxData.to, null)
	let transition = orDefault(boxData.transition, 'fade')
	if (to != null && fn != null) {
		fn = () => { boxData.fn(); goTo(to, transition) }}
	else if (to != null) {
		fn = () => { goTo(to, transition) }}
	
	if (fn != null) { box.onclick = fn }
	
	let id = orDefault(boxData.id, null)
	if (id != null) { box.id = id }
	div.appendChild(box)
}

// todo - consolidate into single 'makeBox' method?
function makePicBox(boxData) {
	let pic = simpleEval(boxData.pic) 
	if (pic == null) { return }

	let img = document.createElement('img')
	img.classList.add('picBox')
	img.src = PIC_PATH + pic + (pic.includes('.') ? '' : '.png')
	let style = orDefault(boxData.style, null)
	if (style != null) { img.style = style }
	let id = orDefault(boxData.id, null)
	if (id != null) { img.id = id }
	
	let offset = orDefault(boxData.offset, null)
	let centerOffset = orDefault(boxData.centerOffset, false)
	if (offset != null) {
		img.style.left = WIDTH * offset[0] - (centerOffset ? (img.width / 2) : 0) + 'px'
		img.style.top = HEIGHT * (1 - offset[1]) - (centerOffset ? (img.height / 2) : 0) + 'px'
	} else { img.classList.add('full') }
	
	let scale = orDefault(boxData.scale, null)
	if (scale != null) { // todo: better
		img.style.width = scale + '%'
		img.style.height = 'auto'
	}
	picsDiv.appendChild(img)
}



function makeEphemeralBox(img, life) { // TODO: ephemeral hitbox too
	if (get(img) != null) { return }
	makePicBox({ 'pic': img, 'id': img })
	wait(life, () => {
		let toRemove = get(img)
		if (toRemove != null) { picsDiv.removeChild(toRemove) }})
}

// TODO: make 'real' js objects? but then - cant encode both in 1 box

// boxData can have:
//                  box? (div)         	pic? (img)		type
// xy (required)	X									val
// to				X									val
// fn				X									fn
// cursor			X									val
// transition		X									val
// pic (required)						X
// offset								X
// centerOffset							X
// if				?					?
// style			X					X
// id				?					?

// STANDARD BOXES ******************************************

function refreshStandardBoxes(frameData) {
	if (frameData == null) { return }
	refreshStandardBox(standardBoxes.left, frameData.left)
	refreshStandardBox(standardBoxes.right, frameData.right)
	refreshStandardBox(standardBoxes.forward, frameData.forward)
	refreshStandardBox(standardBoxes.back, frameData.back)
}

function refreshStandardBox(boxData, destinationFrame) {
	let element = get(boxData.id)
	if (destinationFrame == null) {
		element.style.visibility = 'hidden'
	} else {
		element.style.visibility = 'visible'
		element.onclick = () => { goTo(simpleEval(destinationFrame), boxData.transition) }
	}
}

// INVENTORY ••••••••••••••••••••••••••••••••••••••••••••••••••

function refreshInventory() {
	if (inventory === undefined) { return }
	inventoryDiv.innerHTML = ''
	Object.keys(inventory).forEach(key => { if (s[key] == 0) { makeInventoryItem(key) }})
}

function makeInventoryItem(id) {
	let item = document.createElement('div')
	item.classList.add('inventory')
	item.classList.add('box')
	item.style.left = '0px'
	item.style.top = '0px'
	let img = document.createElement('img')
	img.src = INVENTORY_PATH + inventory[id].img + '.png'
	item.appendChild(img)
	makeDraggable(item, inventory[id].targets)
	inventoryDiv.appendChild(item)
}

// Make given inventory box draggable, execute action if dropped on targetId
function makeDraggable(item, targets) {
	setCursor(item, 'open')
	item.onmousedown = function(event) {
		event.preventDefault()
		//setCursor(item, 'closed')	
		let itemX = parseInt(item.style.left)
		let itemY = parseInt(item.style.top)
		let mouseX = event.clientX
		let mouseY = event.clientY
		document.onmousemove = function(event) {
			event.preventDefault()
			item.style.left = itemX + event.clientX - mouseX + 'px'
			item.style.top = itemY + event.clientY - mouseY + 'px'
		};
		document.onmouseup = function(event) {
			document.onmousemove = null
			document.onmouseup = null
			event.preventDefault()
			for (let i in targets) {
				if (targets[i].frame != null) {
					let parsed = parseFrame(targets[i].frame)
					if (room == parsed[1] && frame == parsed[0]) { targets[i].fn(); return }
				}
				let targetObj = get(targets[i].id)
				if (targetObj != null && isCollide(item, targetObj)) { targets[i].fn(); return }
			}
			item.style.left = itemX
			item.style.top = itemY
			document.onmousemove = null
			setCursor(item, 'open')
		}
	}
}


// GIFS ••••••••••••••••••••••••••••••••••••••••••••••••••
function playGif(name, newFrame, delay, after = null) {
	console.log('name: ' + name)
	//cacheFrame(gameData.rooms[room][newFrame]) //todo - parse here
	let gif = document.createElement('img')
	gif.classList.add('fullGif')
	freeze()
	gif.onload = () => {
		moviesDiv.appendChild(gif)
		if (newFrame != null) { goTo(newFrame, 'fade', true) }
		wait(delay, () => {
			moviesDiv.innerHTML = ''; unfreeze()
			if (after != null) { after() }})}
	gif.src = GIF_PATH + name + '.gif?a=' + Math.random() // todo: better
	// todo - use new object? so it 	
}

// CACHING
let cacheSet = new Set()
function cacheResources(frameData) {
	cacheFrame(frameData.left) //these may be null
	cacheFrame(frameData.right)
	cacheFrame(frameData.forward)
	cacheFrame(frameData.back)
	for (i in frameData.boxes) { cacheFrame(frameData.boxes[i].to) }
}

function cacheFrame(frame) {
	if (frame == null || frame instanceof Function) { return }
	let src
	if (gameData.rooms[room][frame] === undefined) { src = FRAME_PATH + frame + '.' + extension }
	else { src = FRAME_PATH + room  + '/' + frame + '.' + extension }
	if (cacheSet.has(src)) { return }
	if (cacheDiv.childNodes.length >= 20) {
		let cachedImageToRemove = cacheDiv.childNodes[0]
		cacheSet.delete(cachedImageToRemove)
		cacheDiv.removeChild(cachedImageToRemove)
	}
	let cachedImage = new Image()
	cachedImage.src = src
	cacheDiv.appendChild(cachedImage)
	cacheSet.add(src)
}


// SOUND ******************************************

// MUSIC ENGINE: 
// var that tracks
// when you enter / leave a location, fade song from one to another
// add var music var: 0 (no music),
// when that var changes
// possible future options: music start
// todo: add variable length gaps

//music.setAttribute('loop', true)
function setMusic(newMusic) {
	console.log(newMusic)
	if (newMusic == null) { fadeOutMusic(music) }
	else { fadeOutMusic(music, () => {
		music.setAttribute('src', MUSIC_PATH + newMusic + (newMusic.includes('.') ? '' : '.mp3')); 
		music.play(); fadeInMusic(music)})
	}
}
var fadeAudio
function fadeOutMusic(sound, then = null) {
	clearInterval(fadeAudio)
	fadeAudio = setInterval(() => {
        if (sound.volume > 0.1) { sound.volume -= 0.1 }
		else { sound.volume = 0; clearInterval(fadeAudio); if (then != null) { then() }}
    }, 150);
}

function fadeInMusic(sound, then = null) {
	clearInterval(fadeAudio)
	fadeAudio = setInterval(() => {
        if (sound.volume < 0.9) {  sound.volume += 0.1; }
		else { sound.volume = 1; clearInterval(fadeAudio); if (then != null) { then() }}
    }, 150);
}

let sounds = [new Audio(), new Audio(), new Audio] // TODO: make concurrent sounds variable
function playSound(name, volume = 1) {
	for (i in sounds) {
		let sound = sounds[i]
		if (sound.paused) {
			sound.setAttribute('src', SOUND_PATH + name + (name.includes('.') ? '' : '.mp3'))
			sound.volume = volume; sound.play(); return
		}
	}
	alert('no sound!')
}

/*
function initSounds() {
		//let rain = playSound('outsiderain', 1, true)
		//let generator = playSound('reddit', .5, true)
		//json.sounds.rain = rain
		//json.sounds.rain.volume = 0	
		rain.volume = .2
		for (let i = 0; i < 999; i++) {
			//json.sounds.rain.volume += .001
		}
}
function setVolume(n, volume, speed) {
	//	json.sounds.n.volume = volume
}
*/

// HELPERS ******************************************	

function parseFrame(frame) {
	if (typeof frame != 'string') { return [frame, null, null] }
	let room = newExtension = null
	if (frame.includes('/')) {
		let roomFrame = frame.split('/')
		room = roomFrame[0]; frame = roomFrame[1]
	}
	if (frame.includes('.')) {
		let frameExtension = frame.split('/')
		frame = frameExtension[0]; extension = frameExtension[1]
	}
	return [frame, room, extension]
}

function get(id) { return document.getElementById(id) }

function setCursor(element, cursor) {
	if (cursor != null) { element.style.cursor = 'url(' + CURSOR_PATH + cursor + '.png), auto' }
}

function launchFullScreen(element) {
	if(element.requestFullScreen) { element.requestFullScreen() } 
	else if(element.mozRequestFullScreen) { element.mozRequestFullScreen() }
	else if(element.webkitRequestFullScreen) { element.webkitRequestFullScreen() }
}

// If x is a function, returns the result of evaluating x, otherwise returns x
function simpleEval(x) { return (x instanceof Function) ? x() : x }

function orDefault(value, def, eval = true) { return (value == undefined) ? def : 
	(eval ? simpleEval(value) : value) }

function isCollide(a, b) {
	return !(a.y + a.height < b.y || a.y > b.y + b.height ||
		a.x + a.width < b.x || a.x > b.x + b.width)
}