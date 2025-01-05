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
const MOV_PATH = GAME_FOLDER + '/assets/movies/'
const INVENTORY_PATH = PIC_PATH + '/inventory/'

// DOM globals:
let standardBoxesDiv, customBoxesDiv, picsDiv, cacheDiv, transitionsDiv, frameImg, inventoryDiv, cursorBlockDiv, persistentDiv

// Constants:
let CURSOR_PATH, WIDTH, HEIGHT, SIDE_SPEED, FADE_SPEED

// Global vars:
let music = new Audio(); music.loop = true; let cacheSet = new Set()
let sounds = [new Audio(), new Audio(), new Audio, new Audio, new Audio] // TODO: make concurrent sounds variable
let persistentIds = []
window.onload = waitForData()

// hacky way to wait for gameData & s (state) to load
function waitForData() { try { config; roomData; s; init() } catch (e) { console.log(e); wait(.2, waitForData) }}

function init() {
	document.title = (location.hostname == "" ? "." : "") + config.title
	//DOM elements:
	standardBoxesDiv = get('standardBoxes'); customBoxesDiv = get('customBoxes'); picsDiv = get('pics')
	cacheDiv = get('cache'); transitionsDiv = get('transitions'); frameImg = get('frame'); persistentDiv = get('persistents')
	inventoryDiv = get('inventory'); moviesDiv = get('movies'); cursorBlockDiv = get('cursorBlock')
	// global vars:
	room = config.room; frame = config.frame; extension = config.extension
	// constants
	CURSOR_PATH = config.customCursors ? GAME_FOLDER + '/assets/cursors/' : 'assets/cursors/'
	setCursor(get('all'), 'n')
	setCursor(cursorBlockDiv, 's')

	WIDTH = config.frameWidth == null ? 750 : config.frameWidth
	HEIGHT = config.frameHeight == null ? 750 : config.frameHeight
	SIDE_SPEED = .35; FADE_SPEED = 1

	get("all").style.width = WIDTH + "px"; get("all").style.height = HEIGHT + 100 + "px"
	get("screen").style.width = WIDTH + "px"; get("screen").style.height = HEIGHT + "px"
	get("inventory").style.width = WIDTH + "px"
	updateStyle(); setupStandardBoxes(); goTo(frame, 'fade'); refreshInventory(); setMusic(room)
	//window.onclick = launchFullScreen(get('window'))
}

const standardBoxes = {
	left: { xy: [0, .2, .2, .8], transition: 'none', cursor: 'l', id: 'l' },
	right: { xy: [.8, 1, .2, .8], transition: 'none', cursor: 'r', id: 'r' },
	forward: { xy: [.25, .75, .25, .75], transition: 'fade', cursor: 'f', id: 'f' },
	back: { xy: [0, 1, 0, .2], transition: 'fade', cursor: 'b', id: 'b' }}

// DOM setup  ******************************************
function setupStandardBoxes() { for (let i in standardBoxes) { makeBox(standardBoxes[i], standardBoxesDiv) }}

function updateStyle() { // TODO: better.
	get("style").innerHTML =  `
	@keyframes leftIn   { from { transform: translateX(0) } to { transform: translateX(${WIDTH}px) }}
	@keyframes leftOut  { from { transform: translateX(0) }}
	@keyframes rightIn  { from { transform: translateX(0) } to { transform: translateX(-${WIDTH}px) }}
	@keyframes rightOut { from { transform: translateX(0) }}
	@keyframes fadeIn   { from { opacity: 0 } to { opacity: 1 }}
	@keyframes fadeOut  { from { } to { opacity: 0}}
	.leftIn   { animation:leftIn ${SIDE_SPEED}s }
	.leftOut  { animation:leftOut ${SIDE_SPEED}s; transform: translateX(${WIDTH}px) }
	.rightIn  { animation:rightIn ${SIDE_SPEED}s} 
	.rightOut { animation:rightOut ${SIDE_SPEED}s; transform: translateX(-${WIDTH}px) } 
	.fadeIn   { animation:fadeIn ${FADE_SPEED}s; } 
	.fadeOut  { animation:fadeOut ${FADE_SPEED}s; opacity: 0 }`
}

function setFade(fade) { FADE_SPEED = fade; updateStyle() }

function freeze() { cursorBlockDiv.style.visibility = 'visible' }

function unfreeze() { cursorBlockDiv.style.visibility = 'hidden' }

function hideInventory() { inventoryDiv.style.visibility = 'hidden' }

// TRANSITIONS ******************************************
function goTo(newFrame, transitionType = 'fade') { 
	console.log(newFrame)
	if (newFrame == null) return

	if (transitionType != 'none') { createTransition(transitionType + 'Out') }
	
	[frame, newRoom, newExtension] = parseFrame(newFrame)
	if (newRoom != null) { room = newRoom; setMusic(newRoom) }
	let frameData = roomData[room][frame]; if (frameData == null) frameData = {}
	let img
	if (frameData.alt != null && frameData.alt.if()) img = frameData.alt.name
	else img = frame + '.' + (newExtension == null ? extension : newExtension)
	frameImg.src = FRAME_PATH + room + '/' + img
	
	refreshStandardBoxes(frameData); refreshCustomBoxes()
	if (transitionType != 'none') createTransition(transitionType + 'In')
	delay = transitionType == 'none' ? 0 : (transitionType == 'fade') ? FADE_SPEED - .5 : SIDE_SPEED
	 // if we wait full fade speed, it makes moving forward annoying. TODO: better.
	freeze(); wait(delay, () => {
		transitionsDiv.innerHTML = ''; cacheResources(frameData)
		if (frameData.onEnter != null) frameData.onEnter()
		unfreeze() })}

function createTransition(transitionType) {
	let transition = document.createElement('div'); transition.appendChild(frameImg.cloneNode(true)) //creates duplicate img
	let pics = picsDiv.cloneNode(true); pics.id = null
	transition.appendChild(pics)
	transition.classList.add('transition'); transition.classList.add(transitionType)
	if (transitionType == 'leftIn') transition.style.left = -WIDTH + 'px'
	else if (transitionType == 'rightIn') transition.style.left = WIDTH + 'px'
	transitionsDiv.appendChild(transition) }

// BOXES ******************************************
function refresh() { refreshCustomBoxes(); refreshStandardBoxes(); refreshInventory() }

function refreshCustomBoxes() {
	picsDiv.innerHTML = ''; customBoxesDiv.innerHTML = ''
	let frameData = roomData[room][frame]
	if (frameData == null) return
	let boxes = frameData.boxes
	if (boxes != null) {
		for (let i = 0; i < boxes.length; i++) {
			let X = boxes[i]
			if (X.if != null && !X.if()) continue
			makeBox(X, customBoxesDiv); makePic(X) }}

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
			wait(FADE_SPEED - .1, () => { 
				persistentDiv.removeChild(get(id)) })}}

	persistentIds = newIds
}

function makeBox(X, parent) {
	let xy = simpleEval(X.xy)
	if (X.xy == null) return

	let box = document.createElement('div')
	box.className = 'box'
	box.style.left = xy[0] * WIDTH + 'px'
	box.style.width = (xy[1] - xy[0]) * WIDTH + 'px'
	box.style.bottom = xy[2] * HEIGHT + 'px'
	box.style.height = (xy[3] - xy[2]) * HEIGHT + 'px'
	let cursor = orDefault(X.cursor, config.defaultCursor)
	setCursor(box, cursor)

	let fn = orDefault(X.fn, null, false)
	let to = orDefault(X.to, null)
	let transition = orDefault(X.transition, 'fade')
	if (to != null && fn != null) fn = () => { X.fn(); goTo(to, transition) }
	else if (to != null) { fn = () => { goTo(to, transition) }}
	if (fn != null) { box.onclick = fn }
	
	let id = orDefault(X.id, null); if (id != null) box.id = id
	if (X.subBoxes != null) {
		for (i in X.subBoxes) {
			makePic(X.subBoxes[i], box)
			makeBox(X.subBoxes[i], box)
		}
	}
	if (X.drag != null) makeDraggable(box, [])
	parent.appendChild(box) }

// todo - consolidate into single 'makeBox' method?


function makePic(X, parent = picsDiv) {
	let element = document.createElement('img'); element.classList.add('pic')

	let isMovie = X.mov != null
	if (isMovie) parent = moviesDiv
	let name = simpleEval(isMovie ? X.mov : X.pic)
	if (name == null) return
	element.src = (isMovie ? MOV_PATH + name + '/1' : PIC_PATH + name) + (name.includes('.') ? '' : '.png')

	let style = orDefault(X.style, null); if (style != null) { element['style'] = style }
	let id = orDefault(X.id, isMovie ? Math.random() : null); if (id != null) { element.id = id }
	let offset = orDefault(X.offset, null)
	let centerOffset = orDefault(X.centerOffset, false)
	if (offset != null) {
		element.style.left = WIDTH * offset[0] - (centerOffset ? (element.width / 2) : 0) + 'px'
		element.style.top = HEIGHT * (1 - offset[1]) - (centerOffset ? (element.height / 2) : 0) + 'px' }
	else { element.classList.add('full') }
	
	let scale = orDefault(X.scale, null)
	if (scale != null) { // todo: better
		element.style.width = scale + '%'
		element.style.height = 'auto' }
	
	parent.appendChild(element)

	if (isMovie) {
		movieStep({ 
			obj: element, 
			path: MOV_PATH + name + '/', 
			while: X.while,
			step: 0, 
			steps: X.steps, 
			totalSteps: orDefault(X.totalSteps, X.steps),
			destination: X.destination,
			delay: orDefault(X.delay, .1), 
			then: X.then, 
			fate: orDefault(X.fate, 'end'), 
			id: id })}
	
	let life = simpleEval(X.life, null)
	if (life != null) wait(life, () => { parent.removeChild(element) })
	
	return element }

function setIfNotNull(toSet) {

}

// function playMovie(X) {
// let id = orDefault(X.id, Math.random())
// let pic = makePic({ pic: 'movies/' + X.movie + '/1.png', offset: X.offset, id: id }, picsDiv)
// movieStep({ obj: pic, path: MOV_PATH + X.movie + '/', step: 1, steps: X.steps, delay: X.delay, 
// 		then: X.then, fate: X.fate, id: id })}

function playMovie(name, totalSteps, destination) {
	let obj = makePic({ mov: name, id: name, totalSteps: totalSteps }, moviesDiv)
	console.log(obj)
	//movieStep2(obj, 1, .2, MOV_PATH + name + '/', totalSteps, destination)
	//goTo(destination, 'none')
}

function movieStep2(obj, step, delay, path, totalSteps, destination) {
	if (step == totalSteps) {
		moviesDiv.removeChild(obj)
		return
	}
	wait(delay, () => {
		step++; obj.src = path + step + '.png'
		movieStep2(obj, step, delay, path, totalSteps, destination)
	})
}

function movieStep(X) {
	console.log(X)
	if (get(X.id) == null || (X.while != null && !X.while())) return
	X.step++;

	if (X.destination != null && X.step >= X.totalSteps) {
		goTo(X.destination, 'none')
	}
	if (X.step > X.totalSteps) {
		console.log('bye')
		if (X.then != null) X.then()
		if (X.fate == 'end') { moviesDiv.removeChild(X.obj); return }
		if (X.fate == 'stay') return
		if (X.fate == 'loop') X.step = 0 }

	wait(X.delay, () => { 
		X.obj.src = X.path + X.step + '.png';
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

function refreshStandardBoxes(frameData) {
	if (frameData == null) return
	refreshStandardBox(standardBoxes.left, frameData.left); refreshStandardBox(standardBoxes.right, frameData.right)
	refreshStandardBox(standardBoxes.forward, frameData.forward); refreshStandardBox(standardBoxes.back, frameData.back)
}

function refreshStandardBox(boxData, destinationFrame) {
	let element = get(boxData.id)
	if (destinationFrame == null) element.style.visibility = 'hidden'
	else {
		element.style.visibility = 'visible'
		element.onclick = () => { goTo(simpleEval(destinationFrame), boxData.transition) }
	}
}

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
	setCursor(item, 'o')
	item.onmousedown = function(event) {
		event.preventDefault(); setCursor(item, 'o')	
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
				if (targetObj != null && isCollide(item, targetObj)) { console.log(item); target.fn(); return }}
			item.style.left = itemX; item.style.top = itemY
			document.onmousemove = null; setCursor(item, 'o') }}}

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
function setMusic(newMusic) {
	if (newMusic == null) fadeOutMusic(music)
	else { fadeOutMusic(music, () => {
		music.setAttribute('src', MUSIC_PATH + newMusic + (newMusic.includes('.') ? '' : '.mp3')); 
		music.play(); fadeInMusic(music) })}}

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
			sound.setAttribute('id', name)
			sound.setAttribute('src', SOUND_PATH + name + (name.includes('.') ? '' : '.mp3'))
			sound.volume = volume; sound.play(); return sound }}
	alert('no sound!') }

function stopSound(name) { 
	let sound = get(name)
	console.log(sound)
	//.stop()
}

// HELPERS ******************************************	
function parseFrame(frame) {
	if (typeof frame != 'string') return [frame, null, null]
	let room = newExt = null
	if (frame.includes('/')) { let roomFrame = frame.split('/'); room = roomFrame[0]; frame = roomFrame[1] }
	if (frame.includes('.')) { let frameExt = frame.split('/'); frame = frameExt[0]; newExt = frameExt[1] }
	return [frame, room, newExt] }

function get(id) { return document.getElementById(id) }

function setCursor(element, cursor) { if (cursor != null) element.style.cursor = 'url(' + CURSOR_PATH + cursor + '.png) 25 25, auto' }

function launchFullScreen(element) {
	if (element.requestFullScreen) element.requestFullScreen()
	else if (element.mozRequestFullScreen) element.mozRequestFullScreen()
	else if (element.webkitRequestFullScreen) element.webkitRequestFullScreen() }

// If x is a function, returns the result of evaluating x, otherwise returns x
function simpleEval(x) { return (x instanceof Function) ? x() : x }

function orDefault(value, def, eval = true) { return (value == null) ? def : (eval ? simpleEval(value) : value) }

function isCollide(a, b) { 
	console.log(a)
	console.log(b)
	return !(a.y + a.height < b.y || a.y > b.y + b.height || a.x + a.width < b.x || a.x > b.x + b.width) }