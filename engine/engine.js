// TODO - fluent interface for gifs, pics, boxes.
// Ideal: smooth transition between standard box, custom, pic - all on 1 map
// Idea: you move around, but scary creature keeps following you
// understand let vs var etc.
// Add 'gameState' to data
// freeze game data?
// Add 'menu' logic
// Make rooms optional.
// tool to rename image files & frames in js
// gifs as frames option
// no boxes while gif plays... 
// TODO - how to cache when left/right returns fn? framesToCache, or... left: {to: 'A1', fn: ()=> {...}}
// TODO - cache pics/gifs
 
get("favicon").href = GAME_FOLDER + "/favicon.ico"
const FRAME_PATH = GAME_FOLDER + '/assets/frames/'
const GIF_PATH = GAME_FOLDER + '/assets/gifs/'
const SOUND_PATH = GAME_FOLDER + '/assets/sound/'
const PIC_PATH = GAME_FOLDER + '/assets/pics/'
const INVENTORY_PATH = GAME_FOLDER + '/assets/inventory/'

let locks = 0 // whether or not to listen to user input

window.onload = waitForGameData
// hacky way to wait for gameData & s (state) to load
function waitForGameData() {
	try { gameData; s; init() } 
	catch (e) { wait(100, waitForGameData) }
}

// DOM globals:
let standardBoxesDiv, customBoxesDiv, picsDiv, cacheDiv, transitionsDiv, imgDiv, inventoryDiv, gif 
// Constants:
let CURSOR_PATH, WIDTH, HEIGHT, SIDE_SPEED, FADE_SPEED

function init() {
	document.title = location.hostname === "" ? "." + gameData.title : gameData.title

	//DOM elements:
	standardBoxesDiv = get('standardBoxes')
	customBoxesDiv = get('customBoxes')
	picsDiv = get('pics')
	cacheDiv = get('cache')
    transitionsDiv = get('transitions')
    imgDiv = get('img')
    inventoryDiv = get('inventory')
	gif = get('fullGif')
	
	// global vars:
	extension = gameData.extension
	room = gameData.startRoom
	frame = gameData.startFrame
	roomData = gameData.frames[room]
	frameData = roomData[frame]
	
	// constants
	CURSOR_PATH = gameData.customCursors === true ? GAME_FOLDER + '/assets/cursors/' : 'assets/cursors/'
	WIDTH = gameData.frameWidth === undefined ? 750 : gameData.frameWidth
	HEIGHT = gameData.frameHeight === undefined ? 750 : gameData.frameHeight
	SIDE_SPEED = .35 // could be customized
	FADE_SPEED = 1
	get("screen").style.width = WIDTH + "px"
	get("screen").style.height = HEIGHT + "px"
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

	setupStandardBoxes()
	transitionTo(frame, 'fade')
	refreshInventory()
	locks = 0
	//window.onclick = ()=>launchFullScreen(get('window'))
}

const standardBoxes = {
	left: { xy: [0, .2, .2, .8], transition: 'left', cursor: 'left' },
	right: { xy: [.8, 1, .2, .8], transition: 'right', cursor: 'right' },
	forward: { xy: [.25, .75, .25, .75], transition: 'fade', cursor: 'forward' },
	back: { xy: [0, 1, 0, .2], transition: 'fade', cursor: 'back' }
}

// DOM setup  ******************************************
function setupStandardBoxes() {
	for (let i in standardBoxes) { //todo: better
		let boxData = standardBoxes[i]
		let box = makeBox(boxData.xy, boxData.cursor)
		boxData.element = box
		standardBoxesDiv.appendChild(box)
	}
}

// TRANSITIONS ******************************************
function transitionTo(newFrame, type, override = false) {
	console.log(newFrame)
	if (newFrame == null || (locks > 0 && !override)) { return }
	locks++
	setFrame(newFrame)
	if (frameData === undefined) {
		let roomFrame = frame.split("/")
		setRoom(roomFrame[0])
		setFrame(roomFrame[1])
	}
	if (type != 'none') { createTransition(type + 'Out') }
	imgDiv.src = FRAME_PATH + room + '/' + frame + '.' + extension
	refreshStandardBoxes()
	refreshCustomBoxes()
	if (type != 'none') { createTransition(type + 'In') }
	delay = 1000 * (type === 'none' ? 0 : SIDE_SPEED)
	 // if we wait full fade speed, it makes moving forward annoying.
	wait(delay, () => {
		transitionsDiv.innerHTML = ''
		cacheResources()
		locks--
	})
}

function createTransition(type) {
	let transition = document.createElement('div')
	transition.appendChild(imgDiv.cloneNode(true)) //creates duplicate img
	let picBoxes = picsDiv.cloneNode(true)
	picBoxes.id = null
	transition.appendChild(picBoxes)
	transition.classList.add('transition')
	transition.classList.add(type)
	if (type == 'leftIn') { transition.style.left = -WIDTH + 'px' } 
	else if (type == 'rightIn') { transition.style.left = WIDTH + 'px' }
	transitionsDiv.appendChild(transition)
}

// BOXES ******************************************
function refresh() {
	refreshCustomBoxes(); refreshStandardBoxes(); refreshInventory()
}

function refreshCustomBoxes() {
	picsDiv.innerHTML = ''; customBoxesDiv.innerHTML = ''
	let boxes = roomData[frame].boxes
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let boxData = boxes[i]
			if (boxData.if !== undefined && !boxData.if()) { continue }
			makeCustomBox(boxData)
		}
	}
}

// custom box params:
//					type			required?		default			desc	
// xy			[]				yes
// to: 				string			no				none 			equivalent onclick: () => {transition(to, 'fade)} 
// fn: 		function		no				none			
// if:		function		no				true			
// cursor:			string			no				none
// img:				string			no				none
// id:				string			no				none
// transition		string			no				'fade'

function makeEphemeralBox(img, life) { // TODO: ephemeral hitbox too
	if (get(img) != null) { return }
	let ephemeralBox = makePicBox(img, img)
	wait(life, () => {
		picsDiv.removeChild(get(img))
	})
}

// returns a box element from a JSON object containing box info, or null if the box shouldn't exist
function makeCustomBox(boxData) {
	console.log(boxData)
	let transition = boxData.transition == undefined ? 'fade' : boxData.transition
	let fn = boxData.fn
	if (boxData.to !== undefined && boxData.fn !== undefined) {
		fn = () => { boxData.fn(); transitionTo(simpleEval(boxData.to), transition) }
	} else if (boxData.to !== undefined) {
		fn = () => { transitionTo(simpleEval(boxData.to), transition) }
	}
	let pic = simpleEval(boxData.pic)
	if (pic != null) { makePicBox(pic, boxData.id, boxData.offset, boxData.style, boxData.class, boxData.scale) }
	let xy = simpleEval(boxData.xy)
	if (xy != null) {
		let cursor = boxData.cursor === undefined ? 'forward' : simpleEval(boxData.cursor)
		let id = simpleEval(boxData.id)
		let box = makeBox(xy, cursor, fn, id)
		customBoxesDiv.appendChild(box)
	}
}

// todo - consolidate into single 'makeBox' method.

function makePicBox(pic, id, offset = null, style = null, className = null, scale = null) {
	let img = document.createElement('img')
	img.classList.add('picBox')
	if (id != null) { img.id = id }
	if (style != null) { img.style = style }
	if (className != null) { img.classList.add(className) }
	if (scale != null) {
		img.style.width = scale + '%'
		img.style.height = 'auto'
	}
	if (offset != null) { 
		img.style.left = WIDTH * offset[0] + 'px'
		img.style.top = HEIGHT * (1 - offset[1]) + 'px'
	} else {
		img.classList.add('full') 
	}
	img.src = PIC_PATH + pic + (pic.includes('.') ? '' : '.png')
	picsDiv.appendChild(img)
}

function makeBox(xy, cursor, fn = null, id = null) {
	let box = document.createElement('div')
	box.className = 'box'
	box.style.left = xy[0] * WIDTH + 'px'
	box.style.width = (xy[1] - xy[0]) * WIDTH + 'px'
	box.style.bottom = xy[2] * HEIGHT + 'px'
	box.style.height = (xy[3] - xy[2]) * HEIGHT + 'px'
	setCursor(box, cursor)
	if (id != null) { box.id = id }
	if (fn != null) { box.onclick = fn }
	return box
}


// STANDARD BOXES ******************************************

function refreshStandardBoxes() {
	if (roomData[frame] === undefined) { return }
	refreshStandardBox(standardBoxes.left, roomData[frame].left)
	refreshStandardBox(standardBoxes.right, roomData[frame].right)
	refreshStandardBox(standardBoxes.forward, roomData[frame].forward)
	refreshStandardBox(standardBoxes.back, roomData[frame].back)
}

function refreshStandardBox(boxData, destinationFrame) {
	let element = boxData.element
	if (destinationFrame == null) {
		element.style.visibility = 'hidden'
	} else {
		element.style.visibility = 'visible'
		element.onclick = () => { transitionTo(simpleEval(destinationFrame), boxData.transition) }
	}
}

// INVENTORY ••••••••••••••••••••••••••••••••••••••••••••••••••

function refreshInventory() {
	if (inventory === undefined) { return }
	inventoryDiv.innerHTML = ''
	Object.keys(inventory).forEach(key => { if (s[key] == 0) { makeInventoryItem(key) }})
}

function makeInventoryItem(id) {
	console.log(id)
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
				console.log(targets)
				if (targets[i].frame != null) {
					console.log('frame...')
					let roomFrame = targets[i].frame.split('/')
					if (room == roomFrame[0] && frame == roomFrame[1]) {
						console.log('ok...')
						targets[i].fn(); return
					}
				}
				let targetObject = get(targets[i].id)
				if (targetObject != null && isCollide(item, targetObject)) {
					targets[i].fn(); return
				}
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
	cacheFrame(newFrame)
	locks++
	gif.onload = () => {
		get('movies').appendChild(gif)
		gif.style.visibility = 'visible' 
		wait(delay / 2, () => {
			transitionTo(newFrame, 'none', true)
			wait(delay / 2, () => {
				gif.style.visibility = 'hidden'
				locks--
				if (after != null) { after() }
			})})}
	gif.src = GIF_PATH + name + '.gif'//'?a=' + Math.random() 
	// todo - use new object? so it 	
}

// CACHING
let cacheSet = new Set()
function cacheResources() {
	cacheFrame(frameData.left) //these may be null
	cacheFrame(frameData.right)
	cacheFrame(frameData.forward)
	cacheFrame(frameData.back)
	for (i in frameData.boxes) { cacheFrame(frameData.boxes[i].to) }
}

function cacheFrame(frame) {
	if (frame == null || frame instanceof Function) { return }
	let src
	if (roomData[frame] === undefined) {
		src = FRAME_PATH + frame + '.' + extension
	} else {
		src = FRAME_PATH + room  + '/' + frame + '.' + extension
	}
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

function playSound(name, volume=1, loop=false) {
	let sound = new Audio(SOUND_PATH + name + (name.includes('.') ? '' : '.mp3'))
	sound.volume = volume
	sound.play()
	return sound
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

function parseFrame() {} // optional /, optional .

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

// Returns true if a and b are overlapping
function isCollide(a, b) {
	return !(a.y + a.height < b.y || a.y > b.y + b.height ||
		a.x + a.width < b.x || a.x > b.x + b.width)
}

function setFrame(newFrame) {
	frame = newFrame
	frameData = roomData[frame]
}

function setRoom(newRoom, newExtension = extension) {
	room = newRoom;
	extension = newExtension
	roomData = gameData.frames[room]
}