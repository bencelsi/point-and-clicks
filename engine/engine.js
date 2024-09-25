// TODO - branch-based image caching
// TODO - fluent interface for gifs, pics, boxes.
// Ideal: smooth transition between standard box, custom, pic - all on 1 map
// Idea: you move around, but scary creature keeps following you
// understand let vs var etc.
// Add 'gameState' to data
// freeze game data?
// Add 'menu' logic
// Make rooms optional.
// tool to rename image files & frames in js
// optional image size
// gifs as frames option

const commonData = {
    standardBoxes : {
        left: {
            hitbox: [0, .2, .2, .8],
            transition: 'left',
            cursor: 'left' },
        right: {
            hitbox: [.8, 1, .2, .8],
            transition: 'right',
            cursor: 'right' },
        forward: {
            hitbox: [.25, .75, .25, .75],
            transition: 'fade',
            cursor: 'forward' },
        back: {
            hitbox: [0, 1, 0, .2],
            transition: 'fade',
            cursor: 'back' }
    }
}

document.title = location.hostname === "" ? "." + gameData.title : gameData.title

get("favicon").href = gameFolder + "favicon.ico"
console.log(gameFolder)
const GAME_FOLDER = '../games/' + window.location.search.substring(1)

const FRAME_PATH = GAME_FOLDER + '/assets/frames'
const GIF_PATH = GAME_FOLDER + '/assets/gifs/'
const SOUND_PATH = GAME_FOLDER + '/assets/sound/'
const PIC_PATH = GAME_FOLDER + '/assets/pics/'
const INVENTORY_PATH = GAME_FOLDER + '/assets/inventory/'
const CURSOR_PATH = gameData.customCursors === true ? GAME_FOLDER + '/assets/cursors/' : 'assets/cursors/'
const WIDTH = gameData.frameWidth === undefined ? 750 : gameData.frameWidth
const HEIGHT = gameData.frameHeight === undefined ? 750 : gameData.frameHeight
const SIDE_SPEED = .35
const FADE_SPEED = 1

get("screen").style.width = WIDTH + "px"
get("screen").style.height = HEIGHT + "px"

let animationStyle = 
`
@keyframes leftIn { from { transform: translateX(0) } to { transform: translateX(${WIDTH}px) }}
@keyframes leftOut { from { transform: translateX(0) }}
@keyframes rightIn { from { transform: translateX(0) } to { transform: translateX(-${WIDTH}px) }}
@keyframes rightOut {  from { transform: translateX(0) }}
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 }}
@keyframes fadeOut { from { opacity: 1 }}
.leftIn { animation:leftIn ${SIDE_SPEED}s }
.leftOut { animation:leftOut ${SIDE_SPEED}s; transform: translateX(${WIDTH}px) }
.rightIn { animation:rightIn ${SIDE_SPEED}s} 
.rightOut { animation:rightOut ${SIDE_SPEED}s; transform: translateX(-${WIDTH}px) } 
.fadeIn { animation:fadeIn ${FADE_SPEED}s; } 
.fadeOut { animation:fadeOut ${FADE_SPEED}s; opacity: 0 }
`

get("style").innerHTML = animationStyle

// globals consts
const inventory = s.inventory
const standardBoxes = commonData.standardBoxes;

// global vars:
let extension = gameData.extension
let room = gameData.startRoom
let frame = gameData.startFrame
let roomData = gameData.frames[room]
let frameData = roomData[frame]
let processes = 0 // whether or not to listen to user input

// DOM globals:
let standardBoxesDiv
let customBoxesDiv
let picsDiv
let cacheDiv
let transitionsDiv
let imgDiv
let inventoryDiv

window.onload = function() {
	init()
}

function init() {
	standardBoxesDiv = get('standardBoxes')
	customBoxesDiv = get('customBoxes')
	picsDiv = get('pics')
	cacheDiv = get('cache')
    transitionsDiv = get('transitions')
    imgDiv = get('img')
    inventoryDiv = get('inventory')

	setupStandardBoxes()
	transition(frame, 'fade')
	refreshInventory()
	//window.onclick = ()=>launchFullScreen(get('window'))
}

// DOM setup  ******************************************
function setupStandardBoxes() {
	for (let standardBox in standardBoxes) {
		let boxData = standardBoxes[standardBox]
		let box = makeBox(boxData.hitbox, boxData.cursor)
		boxData.element = box
		standardBoxesDiv.appendChild(box)
	}
}

// TRANSITIONS ******************************************
function transition(newFrame, type) {
	console.log(newFrame)
	if (processes > 0) {
		return
	}
	processes++
	frame = newFrame
	frameData = roomData[frame]
	createTransition(type + 'Out')
	imgDiv.src = FRAME_PATH + '/' + room + '/' + frame + '.' + extension
	refreshStandardBoxes()
	refreshCustomBoxes()
	createTransition(type + 'In')
	setTimeout(() => {
		transitionsDiv.innerHTML = ''
		cacheResources()
		processes--
	}, SIDE_SPEED * 1000)
}

function createTransition(type) {
	let transition = document.createElement('div')
	transition.appendChild(get('img').cloneNode(true)) //creates duplicate img
	let picBoxes = picsDiv.cloneNode(true)
	picBoxes.id = null
	transition.appendChild(picBoxes)
	transition.classList.add('transition')
	transition.classList.add(type)
	if (type == 'leftIn') {
		transition.style.left = -WIDTH + 'px'
	} else if (type == 'rightIn') {
		transition.style.left = WIDTH + 'px'
	}
	transitionsDiv.appendChild(transition)
}


// CUSTOM BOXES ******************************************
function refreshCustomBoxes() {
	picsDiv.innerHTML = ''
	customBoxesDiv.innerHTML = ''
	let boxes = roomData[frame].boxes
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let boxData = boxes[i]
			if (boxData.condition !== undefined && !boxData.condition()) {
				continue
			}
			makeCustomBox(boxData)
		}
	}
}

// custom box params:
//					type			required?		default			desc	
// hitbox			[]				yes
// to: 				string			no				none 			equivalent onclick: () => {transition(to, 'fade)} 
// onclick: 		function		no				none			
// condition:		function		no				true			
// cursor:			string			no				none
// img:				string			no				none
// id:				string			no				none

// returns a box element from a JSON object containing box info, or null if the box shouldn't exist
function makeCustomBox(boxData) {
	//console.log(boxData)
	let hitbox = simpleEval(boxData.hitbox)
	let cursor = boxData.cursor === undefined ? 'forward' : simpleEval(boxData.cursor)
	let onclick
	if (boxData.to !== undefined && boxData.onclick !== undefined) {
		onclick = () => { boxData.onclick(); transition(simpleEval(boxData.to), 'fade') }
	} else if (boxData.to !== undefined) {
		onclick = () => { transition(simpleEval(boxData.to), 'fade') }
	} else {
		onclick = boxData.onclick
	}
	
	let id = simpleEval(boxData.id)
	let img = simpleEval(boxData.img)
	if (hitbox != null) {
		let box = makeBox(hitbox, cursor, onclick, id)
		customBoxesDiv.appendChild(box)
	}
	// TODO: combine? box can be pic & hitbox?
	if (img != null) {
		let pic = document.createElement('img')
		pic.classList.add('picBox')
		pic.src = PIC_PATH + simpleEval(boxData.img) + '.png'
		picsDiv.appendChild(pic)
	}
}

function makeBox(hitbox, cursor, onclick = null, id = null) {
	let box = document.createElement('div')
	box.className = 'box'
	box.style.left = hitbox[0] * WIDTH + 'px'
	box.style.width = (hitbox[1] - hitbox[0]) * WIDTH + 'px'
	box.style.bottom = hitbox[2] * HEIGHT + 'px'
	box.style.height = (hitbox[3] - hitbox[2]) * HEIGHT + 'px'
	setCursor(box, cursor)
	if (id != null) { box.id = id }
	if (onclick != null) { box.onclick = onclick }
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
		element.onclick = () => { transition(simpleEval(destinationFrame), boxData.transition) }
	}
}


// INVENTORY ••••••••••••••••••••••••••••••••••••••••••••••••••

function refreshInventory() {
	if (inventory === undefined) {
		return
	}
	get('inventory').innerHTML = ''
	for (let item in inventory) {
		if (inventory[item].state == 1){
			makeInventoryItem(item)
		}
	}
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
	makeDraggable(item, inventory[id].targetId, inventory[id].targetAction)
	get('inventory').appendChild(item)
}

// Make given inventory box draggable, execute action if dropped on targetId
function makeDraggable(item, targetId, targetAction) {
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
			let target = get(targetId)
			if (target != null && isCollide(item, target)){
				targetAction()
			} else {
				item.style.left = itemX
				item.style.top = itemY
				document.onmousemove = null
				setCursor(item, 'open')
			}
		}
	}
}

// CACHING

let cacheSet = new Set()
function cacheResources() {
	cacheFrame(frameData.left) //these may be null
	cacheFrame(frameData.right)
	cacheFrame(frameData.forward)
	cacheFrame(frameData.back)
}

function cacheFrame(frame) {
	if (frame == null || frame instanceof Function) { return }
	
	let src = FRAME_PATH + '/' + room + '/' + frame + '.' + extension
	if (cacheSet.has(src)) { return }

	//console.log("caching " + frame)
	if (cacheDiv.childNodes.length >= 20) {
		let cachedImageToRemove = cacheDiv.childNodes[0]
		console.log('removing ' + cachedImageToRemove)
		cacheSet.delete(cachedImageToRemove)
	}

	let cachedImage = new Image()
	cachedImage.src = src
	cacheDiv.appendChild(cachedImage)
	cacheSet.add(src)
}


// GIFS ••••••••••••••••••••••••••••••••••••••••••••••••••

//Plays the gif of the given name.  Takes the number of frames and the delay to calculate the time... (maybe make this automatic somehow?)
function playGif(name, delay, after = null) {
	processes++
	let gif = get('fullGif')
	gif.src = GIF_PATH + name + '.gif'//'?a=' + Math.random() 
	// todo - use new object? so it 
	gif.style.visibility = 'visible'
	get('movies').appendChild(gif)
	setTimeout(() => {
		gif.style.visibility = 'hidden'
		processes--
		if (after != null) { after() }
	}, delay)
}

function wait(duration, then) {
	setTimeout(() => {
		then()
	}, duration)
}

// SOUND ******************************************

function playSound(name, volume=1, loop=false) {
	let sound = new Audio(SOUND_PATH + name + '.mp3')
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

function get(id) { return document.getElementById(id) }

function setCursor(element, cursor) {
	console.log(cursor)
	if (cursor != null) {
		element.style.cursor = 'url(' + CURSOR_PATH + cursor + '.png), auto'
	}
}

//launches full screen mode on the given element.
function launchFullScreen(element) {
	if(element.requestFullScreen) {
	   element.requestFullScreen()
	} else if(element.mozRequestFullScreen) {
	   element.mozRequestFullScreen()
	} else if(element.webkitRequestFullScreen) {
	   element.webkitRequestFullScreen()
	}
}

// If x is a function, returns the result of evaluating x, otherwise returns x
function simpleEval(x) { return (x instanceof Function) ? x() : x
}

// Returns true if a and b are overlapping
function isCollide(a, b) {
	return !(a.y + a.height < b.y || a.y > b.y + b.height ||
		a.x + a.width < b.x || a.x > b.x + b.width)
}

// TODO: do better.
function setRoom(newRoom, newExtension=extension) {
	if (newRoom == null) {
		roomData = gameData.frames
	} else {
		extension = newExtension
		room = newRoom;
		roomData = gameData.frames[room]
	}
}