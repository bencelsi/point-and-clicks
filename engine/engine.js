// TODO: Saveable state... configurable menu?
// TODO: Make rooms optional/better
// TODO: 'enqueue' a click for fast clickthru
// TODO: cache pics/gifs

/*
SOUND SYSTEM - 
Store audios as objects
    Options - loop?
    on refresh, update audio volumes
music per room or per variable
ideally workable for overlapping sounds
vars for 'music space'
different songs ma
*/



// DOM globals:
const BOX_DIV = 			get('boxes')
const PICS_DIV = 			get('pics')
const CACHE_DIV = 			get('cache')
const TRANSITION_DIV = 		get('transitions')
const FRAME_IMG = 			get('frame')
const PERSISTENT_DIV = 		get('persistents')
const INVENTORY_DIV = 		get('inventory')
const MOVIE_DIV = 			get('movies')
const CURSOR_BLOCK_DIV = 	get('cursorBlock')
const ALL_DIV = 			get('all')

//paths
get('favicon').href = 	GAME_PATH + '/favicon.ico'
const ASSET_PATH = 		GAME_PATH + '/assets/'
const FRAME_PATH = 		ASSET_PATH + '/frames/'
const GIF_PATH = 		ASSET_PATH + '/gifs/'
const SOUND_PATH = 		ASSET_PATH + '/sound/'
const MUSIC_PATH = 		SOUND_PATH + 'music/'
const PIC_PATH = 		ASSET_PATH + '/pics/'
const INVENTORY_PATH = 	ASSET_PATH + '/inventory/'
const MOV_PATH = 		ASSET_PATH + '/movies/'
let CURSOR_PATH = 		'cursors/'


// Global vars:
let music = new Audio; music.loop = true; 
let cacheSet = new Set()
let sounds = [new Audio, new Audio, new Audio, new Audio, new Audio] // TODO: make # of sounds configurable
let persistentIds = []
let c

let waitCounter = 0
window.onload = waitForData()
function waitForData() { 
	try { if (waitCounter > 10) return
		waitCounter++; baseConfig; c; s; gameData; init() } 
	catch (e) { console.log(e); wait(.1, waitForData) }}

function init() {
	c = { ...baseConfig, ...config }
	document.title = (location.hostname == '' ? '.' : '') + c.title
	extension = c.extension
	if (c.customCursors) CURSOR_PATH = ASSET_PATH + 'cursors/'
	setCursor(ALL_DIV, c.defaultCursor)
	if (c.waitCursor != null) setCursor(CURSOR_BLOCK_DIV, c.waitCursor)
	ALL_DIV.style.width = c.width + 'px'; ALL_DIV.style.height = c.height + 100 + 'px'
	get('screen').style.width = c.width + 'px'; get('screen').style.height = c.height + 'px'
	INVENTORY_DIV.style.width = c.width + 'px'
	updateStyle(); refreshInventory(); goTo(s.frame, 'none');
	//window.onclick = launchFullScreen(get('window'))
}

function updateStyle() { // TODO: better.
	get('style').innerHTML =  `
		body { background-color: purple }
		@keyframes leftIn   { from { transform: translateX(0) } to { transform: translateX(${c.width}px) }}
		@keyframes leftOut  { from { transform: translateX(0) }}
		@keyframes rightIn  { from { transform: translateX(0) } to { transform: translateX(-${c.width}px) }}
		@keyframes rightOut { from { transform: translateX(0) }}
		@keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 }}
		@keyframes fadeOut  { from { } to { opacity: 0}}
		.leftIn   { animation:leftIn ${c.sideSpeed}s }
		.leftOut  { animation:leftOut ${c.sideSpeed}s; transform: translateX(${c.width}px) }
		.rightIn  { animation:rightIn ${c.sideSpeed}s} 
		.rightOut { animation:rightOut ${c.sideSpeed}s; transform: translateX(-${c.width}px) } 
		.fadeIn   { animation:fadeIn ${c.fadeSpeed}s; } 
		.fadeOut  { animation:fadeOut ${c.fadeSpeed}s; opacity: 0 }
	`
}


// MENU  ******************************************
function save() {
	
}

function load() {

}

function download() {
	let name ="myFile.grv"
	let contents = JSON.stringify(s)
	var dlink = document.createElement('a');
	dlink.download = name;
	dlink.href = window.URL.createObjectURL(new Blob([contents], { type: "text/plain" }));
	dlink.onclick = function(e) {
		// revokeObjectURL needs a delay to work properly
		var that = this;
		setTimeout(function() {
			window.URL.revokeObjectURL(that.href);
		}, 1500);
	};
	dlink.click();
	dlink.remove();
}

// DOM setup  ******************************************
function freeze() { CURSOR_BLOCK_DIV.style.visibility = 'visible' }

function unfreeze() { CURSOR_BLOCK_DIV.style.visibility = 'hidden' }

function hideInventory() { INVENTORY_DIV.style.visibility = 'hidden' }

function showInventory() { INVENTORY_DIV.style.visibility = 'visible' }

function setFade(fade) { c.fadeSpeed = fade; updateStyle() }



// BOXES ******************************************
function refresh() { refreshBoxes(); refreshInventory() }

function refreshBoxes() {
	PICS_DIV.innerHTML = BOX_DIV.innerHTML = ''
	let frameData = gameData[s.room][s.frame]
	if (frameData == null) return

	for (let key in c.commonBoxes) {
		if (frameData[key] == null) continue
		if (typeof frameData[key] === 'object') makeBox({...c.commonBoxes[key], ...frameData[key]})
		else makeBox({...c.commonBoxes[key], to: frameData[key]})
	}

	let boxes = frameData.boxes
	if (boxes != null) {
		for (let box of boxes) {
			if (box.if != null && !box.if()) continue
			makeBox(box); makePic(box) }}

	// Persistents
	let newIds = []
	let persistents = gameData[s.room]['persistents']
	if (persistents != null) {
		for (let persistent of persistents) {
			if (persistent.if()) {
				newIds.push(persistent.id)
				if (!persistentIds.includes(persistent.id)) { makePic(persistent, PERSISTENT_DIV) }}}}
	
	for (let id of persistentIds) {
		if (!newIds.includes(id)) {
			get(id).classList.add('fadeOut')
			wait(c.fadeSpeed - .1, () => {
				PERSISTENT_DIV.removeChild(get(id)) })}}

	persistentIds = newIds
}

function makeBox(box, parent = BOX_DIV) {
	if (box.xy == null) return
	let element = document.createElement('div'); element.className = 'box'

	box = { ...c.baseBox, ...box }
	for (key in box) { if (key != 'fn') box[key] = simpleEval(box[key]) }

	let x1 = box.xy[0] == 0 ? 0 : (box.xy[0] == 1 ? 1 : (box.xy[0] + c.boxOffset[0]))
	let x2 = box.xy[1] == 0 ? 0 : (box.xy[1] == 1 ? 1 : (box.xy[1] + c.boxOffset[0]))
	let y1 = box.xy[2] == 0 ? 0 : (box.xy[2] == 1 ? 1 : (box.xy[2] + c.boxOffset[1]))
	let y2 = box.xy[3] == 0 ? 0 : (box.xy[3] == 1 ? 1 : (box.xy[3] + c.boxOffset[1]))
	element.style.left = x1 * c.width + 'px'
	element.style.width = (x2 - x1) * c.width + 'px'
	element.style.bottom = y1 * c.height + 'px'
	element.style.height = (y2 - y1) * c.height + 'px'
	setCursor(element, box.cursor)

	//let fn = orDefault(box.fn, null, false)
	//let to = orDefault(box.to, null)
	if (box.to != null && box.fn != null) { element.onclick = () => { box.fn(); goTo(box.to, box.transition) }}
	else if (box.to != null) { element.onclick = () => { goTo(box.to, box.transition) }}
	else if (box.fn != null) { element.onclick = box.fn }
	
	if (box.id != null) element.id = box.id
	if (box.subBoxes != null) {
		for (let subBox of box.subBoxes) makePic(subBox, element); makeBox(subBox, element)
	}
	if (box.drag != null) makeDraggable(element, [])
	parent.appendChild(element)
}

function makePic(picData, parent = PICS_DIV) {
	let basePic = { centerOffset: false }
	
	let X = {...basePic, ...picData}
	for (key in X) { if (key != 'fn' && key != 'while') X[key] = simpleEval(X[key]) }

	let element = document.createElement('img'); element.classList.add('pic')

	let isMovie = X.mov != null
	if (isMovie) parent = MOVIE_DIV
	let name = isMovie ? X.mov : X.pic
	if (name == null) return
	element.src = (isMovie ? MOV_PATH + name + '/1' : PIC_PATH + name) + (name.includes('.') ? '' : '.png')

	if (X.style != null) element['style'] = X.style
	X.id = orDefault(X.id, isMovie ? Math.random() : null); 
	if (X.id != null) element.id = X.id
	if (X.offset != null) {
		element.style.left = c.width * X.offset[0] - (X.centerOffset ? (element.width / 2) : 0) + 'px'
		element.style.top = c.height * (1 - X.offset[1]) - (X.centerOffset ? (element.height / 2) : 0) + 'px' }
	else { element.classList.add('full') }
	
	if (X.scale != null) { // todo: better
		element.style.width = X.scale + '%'
		element.style.height = 'auto' }
	
	parent.appendChild(element)

	if (isMovie) {
		movieStep({ 
			element: element, 
			path: MOV_PATH + name + '/', 
			while: X.while,
			step: 0, 
			steps: X.steps, 
			totalSteps: orDefault(X.totalSteps, X.steps),
			destination: X.destination,
			delay: orDefault(X.delay, .1), 
			then: X.then, 
			fate: orDefault(X.fate, 'end'), 
			id: X.id })}
	
	if (X.life != null) wait(X.life, () => { parent.removeChild(element) })
	
	return element }

// function playMovie(X) {
// let id = orDefault(X.id, Math.random())
// let pic = makePic({ pic: 'movies/' + X.movie + '/1.png', offset: X.offset, id: id }, PICS_DIV)
// movieStep({ obj: pic, path: MOV_PATH + X.movie + '/', step: 1, steps: X.steps, delay: X.delay, 
// 		then: X.then, fate: X.fate, id: id })}

function playMovie(name, totalSteps, destination) {
	let element = makePic({ mov: name, id: name, totalSteps: totalSteps }, MOVIE_DIV)
	console.log(element)
	//movieStep2(obj, 1, .2, MOV_PATH + name + '/', totalSteps, destination)
	//goTo(destination, 'none')
}

function movieStep2(element, step, delay, path, totalSteps, destination) {
	if (step == totalSteps) {
		MOVIE_DIV.removeChild(element)
		return
	}
	wait(delay, () => {
		step++; element.src = path + step + '.png'
		movieStep2(element, step, delay, path, totalSteps, destination)
	})
}

function movieStep(X) {
	console.log(X)
	if (get(X.id) == null || (X.while != null && !X.while())) return
	X.step++;

	if (X.destination != null && X.step >= X.totalSteps) { goTo(X.destination, 'none') }
	if (X.step > X.totalSteps) {
		console.log('bye')
		if (X.then != null) X.then()
		if (X.fate == 'end') { MOVIE_DIV.removeChild(X.element); return }
		if (X.fate == 'stay') return
		if (X.fate == 'loop') X.step = 0 }

	wait(X.delay, () => { 
		X.element.src = X.path + X.step + '.png';
		console.log(X)
		movieStep(X) })}

//                  box? (div)         	pic? (img)		mov
// xy (required)	X									
// to				X									
// fn				X									
// cursor			X									
// transition		X									
// pic (required)						X				X
// offset								X				X
// centerOffset							X				X
// if				?					?				X
// style			X					X				X
// id				?					?				X


// TRANSITIONS ******************************************


function goTo(frame, transitionType = 'fade') {
	console.log('goTo ' + frame)
	if (frame == null) return
	if (transitionType != 'none') { makeTransition(transitionType + 'Out') }
	[s.frame, newRoom, newExtension] = parseFrame(frame)
	if (newRoom != null) { s.room = newRoom; setMusic(newRoom) }
	let frameData = gameData[s.room][s.frame];
	if (frameData == null) frameData = {}
	let img
	if (frameData.alt != null && Data.alt.if()) img = frameData.alt.name
	else img = s.frame + '.' + (newExtension == null ? extension : newExtension)
	FRAME_IMG.src = FRAME_PATH + s.room + '/' + img
	
	refreshBoxes()
	if (transitionType != 'none') makeTransition(transitionType, true)
	delay = transitionType == 'none' ? 0 : (transitionType == FADE ? c.fadeSpeed - .5 : c.sideSpeed)
	 // if we wait full fade speed, it makes moving forward annoying. TODO: better.
	freeze();
	wait(delay, () => {
		TRANSITION_DIV.innerHTML = ''; cacheResources(frameData)
		if (frameData.onEnter != null) frameData.onEnter()
		unfreeze() })
}
// Transition Types:
const LEFT = "left"
const RIGHT = "right"
const FADE = "fade"
const NONE = "none"

function makeTransition(transitionType, isIn) {
	let transition = document.createElement('div');
	let cloned = FRAME_IMG.cloneNode(true)
	transition.appendChild(cloned) //creates duplicate img
	let pics = PICS_DIV.cloneNode(true); pics.id = null
	transition.appendChild(pics)
	transition.classList.add('transition')
	transition.classList.add(transitionType)
	if (transitionType == 'leftIn') transition.style.left = -c.width + 'px'
	else if (transitionType == 'rightIn') transition.style.left = c.width + 'px'
	TRANSITION_DIV.appendChild(transition)
}

// INVENTORY ••••••••••••••••••••••••••••••••••••••••••••••••••

function refreshInventory() {
	if (inventory == null) return
	INVENTORY_DIV.innerHTML = ''
	Object.keys(inventory).forEach(key => { if (s[key] == 0) makeInventoryItem(key) })}

function makeInventoryItem(id) {
	let element = document.createElement('div')
	element.classList.add('inventory') //item.classList.add('box')
	element.style.left = '0px'; element.style.top = '0px'
	let config = inventory[id]
	let img = document.createElement('img')
	img.src = INVENTORY_PATH + config.img + '.png'
	element.appendChild(img)
	if (config.draggable == null || config.draggable) makeDraggable(element, config.targets)
	if (config.cursor != null) setCursor(element, config.cursor)
	if (config.fn != null) element.onclick = config.fn
	INVENTORY_DIV.appendChild(element)
}

// Make given object draggable, execute action if dropped on targetId
function makeDraggable(item, targets) {
	setCursor(item, 'O')
	item.onmousedown = function(event) {
		//freeze()
		event.preventDefault(); setCursor(item, 'C')	
		let itemX = parseInt(item.style.left); let itemY = parseInt(item.style.top)
		let mouseX = event.clientX; let mouseY = event.clientY
		document.onmousemove = function(event) {
			event.preventDefault()
			item.style.left = itemX + event.clientX - mouseX + 'px'
			item.style.top = itemY + event.clientY - mouseY + 'px' }
		document.onmouseup = function(event) {
			//unfreeze()
			document.onmousemove = null; document.onmouseup = null
			event.preventDefault()
			if (targets != null) {
				for (const target of targets) {
					if (target.if != null && target.if()) return
					if (s.frame == target.frame) { target.fn(); return }
					let targetObj = get(target.id)
					if (targetObj != null && isTouching(item, targetObj)) { target.fn(); return }}
			}
			item.style.left = itemX; item.style.top = itemY
			document.onmousemove = null; setCursor(item, 'O') }}}

// GIFS ******************************************
function playGif(name, newFrame, delay, after = null) {
	//cacheFrame(gameData.rooms[s.room][newFrame]) //todo - parse here
	let gif = document.createElement('img')
	gif.classList.add('fullGif'); freeze()
	gif.onload = () => {
		MOVIE_DIV.appendChild(gif)
		if (newFrame != null) { goTo(newFrame, 'fade', true) }
		wait(delay, () => {
			MOVIE_DIV.innerHTML = ''; unfreeze()
			if (after != null) { after() }})}
	gif.src = GIF_PATH + name + '.gif?a=' + Math.random() } // todo: better

// CACHING ******************************************
function cacheResources(frameData) {
	cacheFrame(frameData.left); cacheFrame(frameData.right); cacheFrame(frameData.forward); cacheFrame(frameData.back)
	if (frameData.boxes == null) return
	for (let box of frameData.boxes) { cacheFrame(box.to) }}

function cacheFrame(frame) {
	if (frame == null || frame instanceof Function) return
	let src = (gameData[s.room][frame] == null) ? FRAME_PATH + frame + '.' + extension : 
		FRAME_PATH + s.room  + '/' + frame + '.' + extension
	if (cacheSet.has(src)) return
	if (CACHE_DIV.childNodes.length >= 20) {
		let cachedImageToRemove = CACHE_DIV.childNodes[0]
		cacheSet.delete(cachedImageToRemove)
		CACHE_DIV.removeChild(cachedImageToRemove) }
	let cachedImage = new Image(); cachedImage.src = src
	CACHE_DIV.appendChild(cachedImage); cacheSet.add(src) }

// SOUND ******************************************
// MUSIC ENGINE: 
// var that tracks
// add var music var: 0 (no music),
// when that var changes
// possible future options: music start
// todo: add variable length gaps
// music.setAttribute('loop', true)
function setMusic(newMusic, fade = true) {
	if (newMusic == null) {
		if (fade) fadeOutMusic(music)
		else music.pause()
	} else if (fade) { 
		fadeOutMusic(music, () => {
		music.setAttribute('src', MUSIC_PATH + newMusic + (newMusic.includes('.') ? '' : '.mp3')); 
		music.play(); fadeInMusic(music) })
	} else {
		music.setAttribute('src', MUSIC_PATH + newMusic + (newMusic.includes('.') ? '' : '.mp3')); 
		music.play() }}

function setMusicVolume(volume) { music.volume = volume }

var fadeAudio
function fadeOutMusic(sound, then = null) {
	clearInterval(fadeAudio)
	fadeAudio = setInterval(() => {
        if (sound.volume > 0.1) sound.volume -= 0.1
		else { sound.volume = 0; clearInterval(fadeAudio); if (then != null) { then() }}
    }, 150) }

function fadeInMusic(sound, then = null) {
	clearInterval(fadeAudio)
	fadeAudio = setInterval(() => {
        if (sound.volume < 0.9) sound.volume += 0.1
		else { sound.volume = 1; clearInterval(fadeAudio); if (then != null) then() }
    }, 150) }

function playSound(name, volume = 1) {
	for (let sound of sounds) {
		if (sound.paused) {
			sound.setAttribute('id', name + 'Sound')
			sound.setAttribute('src', SOUND_PATH + name + (name.includes('.') ? '' : '.mp3'))
			sound.volume = volume; sound.play(); return sound }}}

function stopSound(name) { 
	for (let sound of sounds) {
		if (sound.id == name + 'Sound') sound.pause()
	}
}

// HELPERS ******************************************

// [A, 3, B] means: do A, wait 3 seconds, do B
function doInSequence(arr) {
	let time = 0
	for (const x of arr) {
		if (typeof x == 'number') time += x
		else wait(time, x)
	}
}

function parseFrame(frame) {
	if (typeof frame != 'string') return [frame, null, null]
	let room = newExt = null
	if (frame.includes('/')) { let roomFrame = frame.split('/'); room = roomFrame[0]; frame = roomFrame[1] }
	if (frame.includes('.')) { let frameExt = frame.split('/'); frame = frameExt[0]; newExt = frameExt[1] }
	return [frame, room, newExt] }

function get(id) { return document.getElementById(id) }

function setCursor(element, cursor) { if (cursor != null) element.style.cursor = 'url(' + CURSOR_PATH + cursor + '.png), auto' }

function launchFullScreen(element) {
	if (element.requestFullScreen) element.requestFullScreen()
	else if (element.mozRequestFullScreen) element.mozRequestFullScreen()
	else if (element.webkitRequestFullScreen) element.webkitRequestFullScreen() }

// If x is a function, returns the result of evaluating x, otherwise returns x
function simpleEval(x) { return (x instanceof Function) ? x() : x }	

function orDefault(value, def) { return (value == null) ? def : value }

function isTouching(a, b) {
	a = a.getBoundingClientRect(); b = b.getBoundingClientRect()
    return Math.abs(a.x - b.x) < (a.x > b.x ? b.width : a.width) && Math.abs(a.y - b.y) < (a.y > b.y ? b.height : a.height);
}