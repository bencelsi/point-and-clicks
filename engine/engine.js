// TODO: 'enqueue' a click for fast clickthru
// TODO: Add 'menu' logic, saveable state
// TODO: Make rooms optional
// TODO: how to cache when left/right returns fn? framesToCache, or... left: {to: 'A1', fn: ()=> {...}}
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
let boxesDiv = 			get('boxes')
let picsDiv = 			get('pics')
let cacheDiv = 			get('cache') 
let transitionsDiv = 	get('transitions')
let frameImg = 			get('frame')
let persistentDiv = 	get('persistents')
let inventoryDiv = 		get('inventory')
let moviesDiv = 		get('movies')
let cursorBlockDiv = 	get('cursorBlock')
let allDiv = 			get('all')

//paths
get("favicon").href = 	GAME_PATH + '/favicon.ico'
const ASSET_PATH = 		GAME_PATH + '/assets/'
const FRAME_PATH = 		ASSET_PATH + '/frames/'
const GIF_PATH = 		ASSET_PATH + '/gifs/'
const SOUND_PATH = 		ASSET_PATH + '/sound/'
const MUSIC_PATH = 		SOUND_PATH + 'music/'
const PIC_PATH = 		ASSET_PATH + '/pics/'
const INVENTORY_PATH = 	ASSET_PATH + '/inventory/'
const MOV_PATH = 		ASSET_PATH + '/movies/'
let CURSOR_PATH = 		'/cursors/'


// Global vars:
let music = new Audio; music.loop = true; 
let cacheSet = new Set()
let sounds = [new Audio, new Audio, new Audio, new Audio, new Audio] // TODO: make concurrent sounds variable
let persistentIds = []
let c;
window.onload = waitForData()

// hacky way to wait for gameData & s (state) to load
let waitCounter = 0
function waitForData() { 
	try { if (waitCounter > 10) return
		waitCounter++; baseConfig; config; roomData; s; init() } 
	catch (e) { console.log(e); wait(.1, waitForData) }}

function init() {
	c = { ...baseConfig, ...config }

	document.title = (location.hostname == "" ? "." : "") + c.title
	
	room = c.room; 
	frame = c.frame; 
	extension = c.extension

	if (c.customCursors) CURSOR_PATH = ASSET_PATH + '/cursors/'

	setCursor(allDiv, c.defaultCursor)
	if (c.waitCursor != null) setCursor(cursorBlockDiv, c.waitCursor)

	allDiv.style.width = c.width + "px"; 
	allDiv.style.height = c.height + 100 + "px"
	get("screen").style.width = c.width + "px"; 
	get("screen").style.height = c.height + "px"
	inventoryDiv.style.width = c.width + "px"
	updateStyle(); refreshInventory(); goTo(frame, 'none');
	//window.onclick = launchFullScreen(get('window'))
}

function updateStyle() { // TODO: better.
	get("style").innerHTML =  `
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

// DOM setup  ******************************************
function setFade(fade) { c.fadeSpeed = fade; updateStyle() }

function freeze() { cursorBlockDiv.style.visibility = 'visible' }

function unfreeze() { cursorBlockDiv.style.visibility = 'hidden' }

function hideInventory() { inventoryDiv.style.visibility = 'hidden' }

// TRANSITIONS ******************************************
function goTo(newFrame, transitionType = 'fade') { 
	console.log('goTo ' + newFrame)
	if (newFrame == null) return

	if (transitionType != 'none') { makeTransition(transitionType + 'Out') }
	
	[frame, newRoom, newExtension] = parseFrame(newFrame)
	if (newRoom != null) { room = newRoom; setMusic(newRoom) }
	let frameData = roomData[room][frame]; 
	if (frameData == null) frameData = {}
	let img
	if (frameData.alt != null && frameData.alt.if()) img = frameData.alt.name
	else img = frame + '.' + (newExtension == null ? extension : newExtension)
	frameImg.src = FRAME_PATH + room + '/' + img
	
	refreshBoxes()
	if (transitionType != 'none') makeTransition(transitionType + 'In')
	delay = transitionType == 'none' ? 0 : (transitionType == 'fade' ? c.fadeSpeed - .5 : c.sideSpeed)
	 // if we wait full fade speed, it makes moving forward annoying. TODO: better.
	freeze();
	wait(delay, () => {
		transitionsDiv.innerHTML = ''; cacheResources(frameData)
		if (frameData.onEnter != null) frameData.onEnter()
		unfreeze() })
	}

function makeTransition(transitionType) {
	
	let transition = document.createElement('div');
	let cloned = frameImg.cloneNode(true)
	transition.appendChild(cloned) //creates duplicate img
	let pics = picsDiv.cloneNode(true); pics.id = null
	transition.appendChild(pics)
	transition.classList.add('transition')
	transition.classList.add(transitionType)
	if (transitionType == 'leftIn') transition.style.left = -c.width + 'px'
	else if (transitionType == 'rightIn') transition.style.left = c.width + 'px'

	transitionsDiv.appendChild(transition)
}

// BOXES ******************************************
function refresh() { refreshBoxes(); refreshInventory() }

function refreshBoxes() {
	picsDiv.innerHTML = boxesDiv.innerHTML = ''
	let frameData = roomData[room][frame]
	if (frameData == null) return

	for (let key in c.commonBoxes) {
		if (frameData[key] == null) continue
		if (typeof frameData[key] === 'object') makeBox({...c.commonBoxes[key], ...frameData[key]})
		else makeBox({...c.commonBoxes[key], to: frameData[key]})
	}

	let boxes = frameData.boxes
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let box = boxes[i]
			if (box.if != null && !box.if()) continue
			makeBox(box); makePic(box) }}

	// Persistents
	let newIds = []
	let persistents = roomData[room]['persistents']
	if (persistents != null) {
		for (i in persistents) {
			let persistent = persistents[i]
			if (persistent.if()) {
				newIds.push(persistent.id)
				if (!persistentIds.includes(persistent.id)) { makePic(persistent, persistentDiv) }}}}
	
	for (i in persistentIds) {
		let id = persistentIds[i]
		if (!newIds.includes(id)) {
			get(id).classList.add('fadeOut')
			wait(c.fadeSpeed - .1, () => {
				persistentDiv.removeChild(get(id)) })}}

	persistentIds = newIds
}

let boxOffset = [.0,.0]

function makeBox(box, parent = boxesDiv) {
	if (box.xy == null) return
	
	let element = document.createElement('div'); element.className = 'box'

	box = { ...c.baseBox, ...box }
	for (key in box) { if (key != 'fn') box[key] = simpleEval(box[key]) }

	element.style.left = (box.xy[0] + boxOffset[0]) * c.width + 'px'
	element.style.width = (box.xy[1] - box.xy[0]) + boxOffset[0] * c.width + 'px'
	element.style.bottom = (box.xy[2] + boxOffset[1]) * c.height + 'px'
	element.style.height = (box.xy[3] - box.xy[2]) * c.height + 'px'

	setCursor(element, box.cursor)

	//let fn = orDefault(box.fn, null, false)
	//let to = orDefault(box.to, null)
	if (box.to != null && box.fn != null) { element.onclick = () => { box.fn(); goTo(box.to, box.transition) }}
	else if (box.to != null) { element.onclick = () => { goTo(box.to, box.transition) }}
	else if (box.fn != null) { element.onclick = box.fn }
	
	if (box.id != null) element.id = box.id
	if (box.subBoxes != null) {
		for (i in box.subBoxes) makePic(box.subBoxes[i], element); makeBox(box.subBoxes[i], element)
	}
	
	if (box.drag != null) makeDraggable(element, [])
	parent.appendChild(element)
}

// todo - consolidate into single 'makeBox' method?

function makePic(picData, parent = picsDiv) {

	let basePic = {
		centerOffset: false
	}
	
	let X = {...basePic, ...picData}
	for (key in X) { if (key != 'fn' && key != 'while') X[key] = simpleEval(X[key]) }

	let element = document.createElement('img'); element.classList.add('pic')

	let isMovie = X.mov != null
	if (isMovie) parent = moviesDiv
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
// let pic = makePic({ pic: 'movies/' + X.movie + '/1.png', offset: X.offset, id: id }, picsDiv)
// movieStep({ obj: pic, path: MOV_PATH + X.movie + '/', step: 1, steps: X.steps, delay: X.delay, 
// 		then: X.then, fate: X.fate, id: id })}

function playMovie(name, totalSteps, destination) {
	let element = makePic({ mov: name, id: name, totalSteps: totalSteps }, moviesDiv)
	console.log(element)
	//movieStep2(obj, 1, .2, MOV_PATH + name + '/', totalSteps, destination)
	//goTo(destination, 'none')
}

function movieStep2(element, step, delay, path, totalSteps, destination) {
	if (step == totalSteps) {
		moviesDiv.removeChild(element)
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
		if (X.fate == 'end') { moviesDiv.removeChild(X.element); return }
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


// INVENTORY ••••••••••••••••••••••••••••••••••••••••••••••••••

function refreshInventory() {
	if (inventory == null) return
	inventoryDiv.innerHTML = ''
	Object.keys(inventory).forEach(key => { if (s[key] == 0) makeInventoryItem(key) })}

function makeInventoryItem(id) {
	let item = document.createElement('div')
	item.classList.add('inventory') //item.classList.add('box')
	item.style.left = '0px'; item.style.top = '0px'
	let img = document.createElement('img')
	img.src = INVENTORY_PATH + inventory[id].img + '.png'
	item.appendChild(img)
	makeDraggable(item, inventory[id].targets)
	inventoryDiv.appendChild(item) }

// Make given inventory box draggable, execute action if dropped on targetId
function makeDraggable(item, targets) {
	setCursor(item, 'O')
	item.onmousedown = function(event) {
		event.preventDefault(); setCursor(item, 'C')	
		let itemX = parseInt(item.style.left); let itemY = parseInt(item.style.top)
		let mouseX = event.clientX; let mouseY = event.clientY
		document.onmousemove = function(event) {
			event.preventDefault()
			item.style.left = itemX + event.clientX - mouseX + 'px'
			item.style.top = itemY + event.clientY - mouseY + 'px' };
		document.onmouseup = function(event) {
			document.onmousemove = null; document.onmouseup = null
			event.preventDefault()
			for (const target of targets) {
				if (target.if != null && target.if()) { return }
				if (frame == target.frame) { target.fn(); return }
				let targetObj = get(target.id)
				if (targetObj != null && isTouching(item, targetObj)) { target.fn(); return }}
			item.style.left = itemX; item.style.top = itemY
			document.onmousemove = null; setCursor(item, 'O') }}}

// GIFS ••••••••••••••••••••••••••••••••••••••••••••••••••
function playGif(name, newFrame, delay, after = null) {
	//cacheFrame(gameData.rooms[room][newFrame]) //todo - parse here
	let gif = document.createElement('img')
	gif.classList.add('fullGif'); freeze()
	gif.onload = () => {
		moviesDiv.appendChild(gif)
		if (newFrame != null) { goTo(newFrame, 'fade', true) }
		wait(delay, () => {
			moviesDiv.innerHTML = ''; unfreeze()
			if (after != null) { after() }})}
	gif.src = GIF_PATH + name + '.gif?a=' + Math.random() } // todo: better

// CACHING
function cacheResources(frameData) {
	cacheFrame(frameData.left); cacheFrame(frameData.right); cacheFrame(frameData.forward); cacheFrame(frameData.back)
	for (i in frameData.boxes) { cacheFrame(frameData.boxes[i].to) }}

function cacheFrame(frame) {
	if (frame == null || frame instanceof Function) return
	let src
	if (roomData[room][frame] == undefined) src = FRAME_PATH + frame + '.' + extension
	else src = FRAME_PATH + room  + '/' + frame + '.' + extension
	if (cacheSet.has(src)) return
	if (cacheDiv.childNodes.length >= 20) {
		let cachedImageToRemove = cacheDiv.childNodes[0]
		cacheSet.delete(cachedImageToRemove)
		cacheDiv.removeChild(cachedImageToRemove) }
	let cachedImage = new Image(); cachedImage.src = src
	cacheDiv.appendChild(cachedImage); cacheSet.add(src) }

// SOUND ******************************************

// MUSIC ENGINE: 
// var that tracks
// add var music var: 0 (no music),
// when that var changes
// possible future options: music start
// todo: add variable length gaps

//music.setAttribute('loop', true)
function setMusic(newMusic, fade = true) {
		if (newMusic == null) fadeOutMusic(music)
		else if (fade) { 
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
	for (i in sounds) {
		let sound = sounds[i]
		if (sound.paused) {
			sound.setAttribute('id', name + 'Sound')
			sound.setAttribute('src', SOUND_PATH + name + (name.includes('.') ? '' : '.mp3'))
			sound.volume = volume; sound.play(); return sound }}}

function stopSound(name) { 
	let sound = get(name + 'Sound')
	if (sound != null) sound.stop()
	console.log(sound)
}

// HELPERS ******************************************
// [A, 3, B] does A, waits 3 seconds, then does B
function doInSequence(arr) {
	let time = 0
	for (const x of arr) {
		if (typeof x === "number") time += x
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
	a = a.getBoundingClientRect();
	b = b.getBoundingClientRect();
    return Math.abs(a.x - b.x) < (a.x < b.x ? b.width : a.width) && Math.abs(a.y - b.y) < (a.y < b.y ? b.height : a.height);

}