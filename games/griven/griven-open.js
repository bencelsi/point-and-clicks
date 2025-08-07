// TODOS:

const config = { 
    title: 'Griven (Open World Version)', 
    extension: 'png', width: 1000, height: 750,
    customCursors: true,
    defaultCursor: 'N',
    boxCursor: 'O',
    waitCursor: 'S',
    fadeSpeed: 1,
    inventoryCursor: 'O',
    inventoryDragCursor: null,
    commonBoxes: {
		left: { xy: [0, .2, .2, .8], transition: LEFT, cursor: 'L' },
		right: { xy: [.8, 1, .2, .8], transition: RIGHT, cursor: 'R' },
		forward: { xy: [.25, .75, .25, .75], transition: FADE, cursor: 'F', id: 'forwardBox' },
		back: { xy: [0, 1, 0, .2], transition: FADE, cursor: 'B', id: 'backBox' }},
    boxOffset: [-.02, .02]
}

// STATE or, use history.pushState() 
const s = {   room: 'lobby', frame: 'A1', //room: 'opening', frame: 'menu',
/*inventory*/ brochure: 0, smallKey: 4, pipe: 4, coffee: 4, card: [2, 7, 1], pig: 10, goldKey: 4,
/*lobby*/     lightsOn: false, cabinetDown: false, drawers: [false, false, false, false], clock1: 350, clock2: 359,
/*clock*/     clockUnlocked: true, gearsOk: true, clockOn: true, jesusCount: 0, gears: [0, 3, 2, 1, 3, 2, 1, 2, 3, 3, 3],
/*cafe*/      cafeUnlocked: true, saladZoom: 0, salads: [3, 3, 3, 3, 3],
/*plumbing*/  plumbUnlocked: true, plumbOpen: false, valves: [false, true, true, true, true, true], floorValve: 2, heaterLevel: 100,
/*elevator*/  elevatorFloor: 1, elevatorGoal: 1, elevatorMoving: false, elevatorFixed: true, circuits: [2, 0, 0, 1, 1, 0, 1, 0, 1, 0],
/*hall/room*/ hallPosition: 0, hallDirection: 0, floor: 1, fire: false, speakerVolume: 0, shower: 0, steamLevel: 0, 
/*office*/    officeUnlocked: true, otherLeft: true, bobbSpeech: true }

// non-saveable state
let waitId = 0; let combo = []

//map of room to song
const musicMap = {
    'hall' : 'stairs'
}


const inventory = {
    brochure: { img: 'brochure', draggable: false, cursor: 'Z', fn: () => { brochureBack = s.room + '/' + s.frame; hideInventory(); goTo('brochure/0') }},
    smallKey: { img: 'smallkeyFree', targets: [{ id: 'keyhole', fn: () => { s.smallKey = 2; refresh(); 
        if (s.frame == 'D4') { freeze(); makePic({ pic: 'smallKey1'}); wait(1, () => { goTo('D3'); unfreeze() })}}}]},
    pipe: { img: 'pipeFree', targets: [{ id: 'pipe2', fn: () => { s.pipe = 2; refresh() }},
        { id: 'pipe3', fn: () => { s.pipe = 3; refresh()} }]},
    coffee: { img: 'coffeeFree', targets: [{ frame: 'stairs/B5a', fn: () => { s.coffee = 3; refresh() }}]},
    card: { img: 'cardFree', targets: [{ id: 'cardSlot', fn: () => { s.card = [s.floor, s.hallPosition, s.hallDirection]; refresh() }}]},
    pig: { img: 'pigFree', targets: [{ id: 'pigWindow', fn: () => { playSound('pigFalls'); s.pig = 2; s.goldKey = 2; refresh() }},
        { if: () => { return s.room == 'stairs' && s.frame.startsWith('A') },
        fn: () => { playSound('pigFalls'); s.pig = 3; s.goldKey = 3; refreshInventory() }}]},
    goldKey: { state: 1, img: 'goldKeyFree', targets: [{ id: 'goldKeyhole', fn: () => { s.goldKey = 4; refresh() }}]}}

var brochureBack

const elevatorBoxes = [
    { xy: [.81, .84, .06, .1], fn: () => { setElevatorFloor(1)} }, { xy: [.87, .9, .06, .1], fn: () => { setElevatorFloor(2)} },
    { xy: [.81, .84, .16, .2], fn: () => { setElevatorFloor(3)} }, { xy: [.87, .9, .16, .2], fn: () => { setElevatorFloor(4)} },
    { xy: [.81, .84, .27, .31], fn: () => { setElevatorFloor(5)} }, { xy: [.87, .9, .27, .31], fn: () => { setElevatorFloor(6)} },  
    { xy: [.81, .84, .37, .42], fn: () => { setElevatorFloor(7)} }, { xy: [.87, .9, .37, .42], fn: () => { setElevatorFloor(8)} },
    { xy: [.81, .84, .48, .52], fn: () => { setElevatorFloor(9)} }, { xy: [.87, .9, .48, .52], fn: () => { setElevatorFloor(10)} },
    { xy: [.81, .9, .52, .6], to: 'A3' }, { xy: [.92, 1, .2, .8], to: 'A1', cursor: 'r', transition: 'r' },
    { pic: () => { return 'elevator' + s.floor }, offset: [.82, .97], scale: '6'},
    { pic: () => { return 'floor' + s.floor }, offset: [.471, .65], scale: '6', if: () => { return s.frame == 'A2b'}}]

const outerElevatorBox = { pic: () => { return  'elevator' + s.elevatorFloor }, offset: [.275, .842], scale: '4' }

const keypadButtons = [
    { xy: [.16, .29, .68, .86], fn: () => { pushKeypad(0) }}, { xy: [.3, .42, .68, .86], fn: () => { pushKeypad(1) }},
    { xy: [.44, .56, .68, .86], fn: () => { pushKeypad(2) }}, { xy: [.58, .7, .68, .86], fn: () => { pushKeypad(3) }},
    { xy: [.72, .84, .68, .86], fn: () => { pushKeypad(4) }}, { xy: [.16, .29, .46, .66], fn: () => { pushKeypad(5) }},
    { xy: [.3, .42, .46, .66], fn: () => { pushKeypad(6) }}, { xy: [.44, .56, .46, .66], fn: () => { pushKeypad(7) }},
    { xy: [.58, .7, .46, .66], fn: () => { pushKeypad(8) }}, { xy: [.72, .84, .46, .66], fn: () => { pushKeypad(9) }}]

function closeBrochure () {
    showInventory()
    goTo(brochureBack)
}

const gameData = {
'opening': {
    'menu': { onEnter: () => { hideInventory() }, boxes: [{ xy: [0, 1, 0, 1], to: 'A0' }]},
    'A0': { onEnter: () => { doInSequence([
        () => { freeze(); setMusic(null); playSound('music/opening'); setFade(4); goTo('A1') }, 4,
        () => { playGif('opening', 'A2', 4) }, 4,
        () => { playSound('music/title') }, 2, 
        () => { goTo('A3') }, 4,
        () => { showInventory(); goTo('lobby/A1') }, 4,
        () => { setFade(1); unfreeze() }])}}},
'brochure': { 0: { right: { to: 1, fn: () => { playSound('page') }}, back: { fn: closeBrochure }}, 
    1: { left: { to: 0, fn: () => { playSound('page') }}, right: { to: 2, fn: () => { playSound('page') }}, back: { fn: closeBrochure }},
    2: { left: { to: 1, fn: () => { playSound('page') }}, right: { to: 3, fn: () => { playSound('page') }}, back: { fn: closeBrochure }},
    3: { left: { to: 2, fn: () => { playSound('page') }}, right: { to: 4, fn: () => { playSound('page') }}, back: { fn: closeBrochure }},
    4: { left: { to: 3, fn: () => { playSound('page') }}, back: { fn: closeBrochure }}},
'lobby' : { //zlobby
    'A1': { left: 'A4', right: 'A2', forward: 'B1' },
    'A2': { left: 'A1', right: 'A3', boxes: [{ to: 'A5', xy: [.37, .76, .25, .7], cursor: 'Z' }]},
    'A3': { left: 'A2', right: 'A4' },
    'A4': { left: 'A3', right: 'A1' },
    'A5': { back: 'A2' },
    'B1': { left: 'B4', right: 'B2', forward: { fn: () => {
        playGif('grandUp', 'C1', 10 * .15)
        //playSound('grandUp'); makePic({mov: 'grandUp', totalSteps: 10, delay: .2, destination: 'C1'})
    }},
       
        boxes: [{ to: 'D1', xy: [.15, .23, .4, .56], cursor: 'F' }, { to: 'E1', xy: [.84, .95, .4, .58], cursor: 'F' }]},
    'B2': { left: 'B1', right: 'B3', forward: 'E2', boxes: [{ xy: [.4, .63, .7, 1], to: 'E4', cursor: 'Z' }]},
    'B3': { left: 'B2', right: 'B4', forward: 'A3' },
    'B4': { left: 'B3', right: 'B1', forward: 'D3', boxes: [{ pic: 'cabinetDown3', if: () => { return s.cabinetDown }}]},
    'C1': { left: 'C4', right: 'C2', boxes: [outerElevatorBox, 
        { xy: [.28, .31, .48, .52], to: () => { return s.elevatorFloor == 1 ? 'C1b' : (!s.elevatorFixed ? 'C1a' : null) },
        fn: () => { if (s.elevatorFloor == 1 || !s.elevatorFixed) { playSound('elevatorOpen') } else { callElevator() }}}]},
    'C1a': { 
        left: { to: 'C4', fn: () => { playSound('elevatorClose') }}, 
        right: { to: 'C2', fn: () => { playSound('elevatorClose') }},
        boxes: [outerElevatorBox, { to: 'C5', xy: [.35, .66, .17, .88], cursor: 'Z' },
        { to: 'C1', fn: () => { playSound('elevatorClose')}, xy: [.28, .31, .48, .52] }]},
    'C1b': { 
        left: { to: 'C4', fn: () => { playSound('elevatorClose') }},
        right: { to: 'C2', fn: () => { playSound('elevatorClose') }},
        boxes: [outerElevatorBox, 
            { to: 'C1', fn: () => { playSound('elevatorClose') }, xy: [.28, .31, .48, .52] },
            { to: 'elevator/A1', xy: [.35, .66, .17, .88] }]},
    'C2': { left: 'C1', right: 'C3' },
    'C3': { left: 'C2', right: 'C4', forward: { fn: () => { playSound('grandDown'); playGif('grandDown', 'B3', 10 * .15)}}},
    'C4': { left: 'C3', right: 'C1', boxes: [{ to: 'C6', xy: [.4, .61, .25, .36], cursor: 'Z' }]},
    'C5': { back: 'C1a' },
    'C6': { back: 'C4' },
    'D1': { left: 'D3', right: 'D2', forward: 'F1'},
    'D2': { left: 'D1', right: 'D3', boxes: [{ to: 'B2', xy: [.2, .4, .2, .8], cursor: 'F' }, 
        { to: 'B3', xy: [.4, .8, .2, .8], cursor: 'F' }]},
    'D3': { left: 'D2', right: 'D1', boxes: [{ fn: () => { playSound('bell') }, xy: [.49, .55, .34, .4] },
        { fn: () => { playSound('lightswitch'); s.lightsOn = !s.lightsOn; refresh()}, xy: [.84, .88, .57, .64] },
        { pic: 'switch', if: () => { return s.lightsOn }}, { pic: 'smallKey2', if: () => { return s.smallKey == 2 }},
        { xy: () => { return s.drawers[0] ? [.3, .37, .38, .48] : [.22, .3, .38, .48] }, 
            fn: () => { if (s.smallKey == 2) { playSound('cabinet' + (s.drawers[0] ? 'Close' : 'Open')); changeDrawer(0) }
                 else { goTo('D4') }}, if: () => { return !s.cabinetDown }, 
            cursor: () => { return s.smallKey == 2 ? 'O' : 'Z' }},
        { pic: 'drawer0', if: () => { return s.drawers[0] }},
        { xy: () => { return s.drawers[1] ? [.3, .37, .48, .57] : [.22, .3, .48, .57] }, 
            fn: () => { playSound('cabinet' + (s.drawers[1] ? 'Close' : 'Open')); changeDrawer(1) }, 
            if: () => { return !s.cabinetDown }},
        { pic: 'drawer1', if: () => { return s.drawers[1] }},
        { xy: () => { return s.drawers[2] ? [.3, .37, .57 ,.66] : [.22, .3, .57 ,.66] }, 
            fn: () => { playSound('cabinet' + (s.drawers[2] ? 'Close' : 'Open')); changeDrawer(2) }, 
            if: () => { return !s.cabinetDown }},
        { pic: 'drawer2', if: () => { return s.drawers[2] }},
        { xy: () => { return s.drawers[3] ? [.3, .37, .66 ,.76] : [.22, .3, .66 ,.76] }, 
            fn: () => { playSound('cabinet' + (s.drawers[3] ? 'Close' : 'Open')); changeDrawer(3) }, 
            if: () => { return !s.cabinetDown }},
        { pic: 'drawer3', if: () => { return s.drawers[3] }},
        { pic: 'lightLeft', if: () => { return s.lightsOn && !s.cabinetDown }},
        { pic: () => { return 'lightRight' + (s.smallKey == 1 ? 'Key' : '') }, if: () => { return s.lightsOn }},
        { if: () => { return s.lightsOn && s.smallKey == 1 }, xy: [.58, .64, .41 ,.45], fn: () => { s.smallKey = 0; refresh() }},
        { pic: () => { return 'cabinetDown' + (s.lightsOn ? '2' : '1') }, if: () => { return s.cabinetDown }}],
    toCache: ['lightRight', 'lightRightKey', 'cabinetDown1', 'cabinetDown2']},
    'D4': { back: 'D3', boxes: [{ xy: [.41, .48, .6, .67], id: 'keyhole', cursor: 'n' }] },
    'E1': { left: 'E3', right: 'E2', boxes: [{ to: 'G1', xy: [.57, .73, .35, .62], cursor: 'F' }]},
    'E2': { left: 'E1', right: 'E3', boxes: [{ to: 'E4', xy: [.4, .85, .8, 1], cursor: 'Z' }]},
    'E3': { left: 'E2', right: 'E1', boxes: [{ to: 'B3', xy: [.2, .5, .2, .8], cursor: 'F' },
        { to: 'B4', xy: [.5, .8, .2, .8], cursor: 'F' }, { if: () => { return s.cabinetDown }, pic: 'cabinetDown4'}]},
    'E4': { back: 'E2', boxes: [{ pic: 'clockHand1', offset: [.485, .81], style: () => { 
            return 'transform: rotate(' + s.clock1 + 'deg); transform-origin: center bottom' }},
        { pic: 'clockHand2', offset: [.48, .73], style: () => { 
            return 'transform: rotate(' + s.clock2 + 'deg); transform-origin: center bottom' }}]},
    'F1': { left: 'F2', right: 'F2', forward: { fn: () => {
        s.floor = 2; playSound('stairsUp'); playGif('stairsBottomUp', 'stairs/C1', 13 * .15, () => {
        wait(.5, () => { playSound('stairsUp'); playGif('stairsMiddleUp1', 'stairs/A1', 9 * .15) })})}}},
    'F2': { left: 'F1', right: 'F1', forward: 'D2' },
    'G1': { left: 'G2', right: 'G2', forward: 'H1' },
    'G2': { left: 'G1', right: 'G1', forward: 'E3', back: 'H3' },
    'H1': { left: 'H4', right: 'H2', boxes: [{ to: 'I1', xy: [.35, .48, .23, .55], cursor: 'F' }]},
    'H2': { left: 'H1', right: 'H3', boxes: [{ to: 'pool/A2', xy: [.25, .48, .23, .73] } ]},
    'H3': { left: 'H2', right: 'H4', boxes: [{ to: 'G2', xy: [.25, .5, .2, .6], cursor: 'F' }]},
    'H4': { left: 'H3', right: 'H1', boxes: [{ xy: [.57, .7, .4, .63], to: () => { if (s.cafeUnlocked) return 'H4a' },
        fn: () => { playSound(s.cafeUnlocked ? 'doorOpen' : 'doorLocked') }}]},
    'H4a': { left: { to: 'H3', fn: () => { playSound('doorClose') }}, right: { to: 'H1', fn: () => { playSound('doorClose') }}, 
        boxes: [{ to: 'cafe/A4', xy: [.4, .85, .2, .8] }]},
    'I1': { left: 'I4', right: 'I2', boxes: [{ to: 'I5', xy: [.57, .8, .53, .68], cursor: 'Z' }]},
    'I2': { left: 'I1', right: 'I3', boxes: [{ xy: [.39, .43, .53, .64], fn: () => { 
            playSound('toilet' + (s.valves[0] ? 'Flush' : 'Empty')); makePic({ pic: 'toiletHandle', life: .7}); 
            if (s.valves[0] && s.valves[1] && s.pipe == 2) s.heaterLevel = Math.min(100, s.heaterLevel + 10) }}]},
    'I3': { left: 'I2', right: 'I4', forward: 'H3' },
    'I4': { left: 'I3', right: 'I1' },
    'I5': { back: 'I1' }},
'pool': { //zpool
    'A1': { left: 'A4', right: 'A2', boxes: [{ to: 'A7', xy: [.37, .65, .35, .75], cursor: 'Z' },
        { pic: 'valve0-mini', if: () => { return s.valves[0] }},
        { pic: 'poolPigKey', if: () => { return s.goldKey == 2 }},
        { pic: 'poolPigKey', if: () => { return s.goldKey == 2 }},
        { pic: 'poolPig', if: () => { return s.pig == 2 & s.goldKey != 2  }}]},
    'A2': { left: 'A1', right: 'A3', forward: 'A5' },
    'A3': { left: 'A2', right: 'A4', boxes: [
        { xy: [.54, .65, .3, .51], to: () => { return s.clockUnlocked ? 'A3a' : 'A6' }, cursor: () => { return s.clockUnlocked ? 'O' : 'Z' }}]},
    'A3a':{ left: { to: 'A2', fn: () => { playSound('doorClose') }},
            right: { to: 'A4', fn: () => { playSound('doorClose') }}, boxes: [{ to: 'B3', xy: [.54, .65, .3, .51], cursor: 'F' }]},
    'A4': { left: 'A3', right: 'A1', forward: 'lobby/H4' },
    'A5': { back: 'A2'},
    'A6': { back: 'A3', boxes: keypadButtons },
    'A7': { back: 'A1', boxes: [{ xy: [.48, .55, .91, 1], fn: () => { flipValve(0) },
            pic: () => { return s.valves[0] ? 'valve0' : null }}]},
    'B1': { left: 'B4', right: 'B2', forward: 'A1' },
    'B2': { left: 'B1', right: 'B3' },
    'B3': { left: 'B2', right: 'B4', boxes: [
        { xy: [.2, .8, .4, 1], fn: () => { playGif('ladderUp', 'clockroom/A3', 10 * .15) }, cursor: 'F'}]},
    'B4': { left: 'B3', right: 'B1' }},
'clockroom' : {
    'A1': { left: 'A4', right: 'A2', forward: { fn: () => { playGif('ladderDown', 'pool/B1', 10 * .15) }}},
    'A2': { left: 'A1', right: 'A3', boxes: [{ xy: [.29, .34, .42, .48], if: () => { return !s.clockOn }, 
        fn: () => { playSound('gearsRunning'); s.clockOn = true; refreshBoxes()
        if (s.gearsOk) { clockOn() } else { freeze(); wait(4.5, () => { s.clockOn = false; refreshBoxes(); unfreeze() })}}},
        //{ mov: 'gear1', steps: 3, fate: 'loop', if: () => { return s.clockOn }, while: () => { return s.clockOn }},
        { pic: 'lever', if: () => { return s.clockOn } },
        { xy: [.48, .6, .22, .3], to: 'A5' },
        { xy: [.65, .75, .21, .29], to: 'A6', pic: 'jesusNote', if: () => { return s.jesusCount >= 3 }, cursor: 'Z'}]},
    'A3': { left: 'A2', right: 'A4', boxes: [
        { pic: 'gear2.gif', offset: [0,.6], scale: 10 },
        { pic: 'gear3.gif', offset: [.77,.82], scale: 23 },
        //{ mov: 'gear2', steps: 3, fate: 'loop', if: () => { return s.clockOn }},
        //{ mov: 'gear3', steps: 3, fate: 'loop', if: () => { return s.clockOn }},
        
        { pic: 'gearTray0' }, { pic: 'gearTray2' }, { pic: 'gearTray4' }, { pic: 'gearTray6' }, 
        { pic: 'gearTray1' }, { pic: 'gearTray3' }, { pic: 'gearTray5' }]},
    'A4': { alt: { name: 'A4.gif', if: () => { return s.clockOn }}, left: 'A3', right: 'A1', forward: 'A7' },
    'A5': { back: () => { s.jesusCount++; if (s.jesusCount == 3) { 
        doInSequence([
            () => { freeze(); setMusic(null); playSound('jesus') }, 2,
            () => { goTo('A2a') }, 8, () => { goTo('A2'); setMusic('clockroom'); unfreeze() }
        ])} else { return 'A2' }}},
    'A6': { back: 'A2' },
    'A7': { alt: { name: 'A7.gif', if: () => { return s.clockOn }}, back: 'A4' }},
'cafe': { //zcafe
    'A1': { left: 'A4', right: 'A2', boxes: [{ to: 'A7', xy: [.62, .78, .42, .6], cursor: 'Z' }, 
        { to: () => { return s.plumbUnlocked ? 'A1a' : 'A6' }, xy: [.3, .35, .5, .6], cursor: () => { return s.plumbUnlocked ? 'O' : 'Z' },
          fn: () => { if (s.plumbUnlocked) playSound('doorOpen') }}]},
    'A1a': { left: { to: 'A4', fn: () => { playSound('doorClose') }}, right: { to: 'A2', fn: () => { playSound('doorClose') }}, 
        boxes: [{ to: 'A5', xy: [.28, .46, .28, .75] }, { to: 'A7', xy: [.62, .78, .42, .6] }]},
    'A2': { left: 'A1', right: 'A3', forward: { to: 'lobby/H2', fn: () => { playSound('doorClose'); return 'lobby/H2' }}},
    'A3': { left: 'A2', right: 'A4' },
    'A4': { left: 'A3', right: 'A1', forward: 'B4' },
    'A6': { back: 'A1', boxes: keypadButtons }, 
    'A7': { back: () => { return s.plumbOpen ? 'A1a' : 'A1' }, boxes: [
        // { pic: 'coffee1', xy: [.34, .44, .18, .4], cursor: () => { return s.coffee == 2 ? 'F' : null },
        //     fn: () => { if (s.coffee == 2) { s.coffee = 0; refresh()}}, if: () => { return s.coffee == 1 || s.coffee == 2 }},
        { xy: [.34, .4, .46, .52], fn: () => { playSound('button')
            if (s.heaterLevel > 0 && !s.valves[2] && s.valves[4] && s.pipe == 3) { 
                playSound('slurp'); s.coffee = 2; refreshBoxes() }
            else { makePic({ pic: 'noWater', scale: 15, offset: [.413, .55], life: .8 })}}}]},
    'A5': { forward: 'plumbingroom/A1', back: 'A1a' },
    'B1': { left: 'B4', right: 'B2', boxes: [{ xy: [.2,.8,.4,1], to: 'B5' }]},
    'B2': { left: 'B1', right: 'B3', forward: 'A2' },
    'B3': { left: 'B2', right: 'B4', forward: 'H4' },
    'B4': { left: 'B3', right: 'B1', boxes: [
        //{ pic: 'bowl' },
        { xy: [.4, .53, .3, .39], drag: { x: [.1,.9] }, //subBoxes: [{ pic: 'bowl', scale: 100 }]
        },
        { xy: [.05, .2, .46, .5], fn: () => { s.saladZoom = 0 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[0]] }},
        { xy: [.22, .35, .46, .5], fn: () => { s.saladZoom = 1 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[1]] }},
        { xy: [.38, .51, .46, .5], fn: () => { s.saladZoom = 2 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[2]] }},
        { xy: [.54, .67, .46, .5], to: () => { s.saladZoom = 3 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[3]] }},
        { xy: [.7, .84, .46, .5], to: () => { s.saladZoom = 4 }, to: () => { return 'B6' + ['c', 'b', 'a', ''][s.salads[4]] }},
        { xy: [.09, .12, .42, .46], fn: () => { saladButton(0);
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.1, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.127, .548], scale: 3.5 })}})}},
        { xy: [.26, .29, .42, .46], fn: () => { saladButton(1)
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.28, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.28, .548], scale: 3.5 })}})}},
        { xy: [.43, .46, .42, .46], fn: () => { saladButton(2);
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.46, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.436, .548], scale: 3.5 })}})}},
        { xy: [.6, .63, .42, .46], fn: () => { saladButton(3) 
            makePic({ mov: 'salad', steps: 13, delay: .06, offset: [.637, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.59, .548], scale: 3.5 })}})}},
        { xy: [.77, .8, .42, .46], fn: () => { saladButton(4) 
            makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.82, .39], scale: 3.5, then: () => {
                makePic({ mov: 'salad', steps: 13, delay: .05, offset: [.747, .548], scale: 3.5 })}})}}]},
    'B5': { back: 'B1'}, 'B6': { back: 'B4'}, 'B6a': { back: 'B4'}, 'B6b': { back: 'B4'},
    'B6c': { back: 'B4', boxes: [
        { pic: () => { return 'salad' + [8, 7, 0, 1, 2][s.saladZoom]}, offset: [.45, .65], style: 'opacity: 50%;' }]}},
'plumbingroom': { //zplumbing
    'A1': { left: 'A4', right: 'A2', boxes: [
        { xy: [.35, .41, .13, .22], fn: () => { setFloorValve(2) }}, { xy: [.41, .48, .13, .22], fn: () => { setFloorValve(3) }},
        { xy: [.48, .54, .13, .22], fn: () => { setFloorValve(4) }}, { xy: [.54, .6, .13, .22], fn: () => { setFloorValve(5) }},
        { xy: [.6, .67, .13, .22], fn: () => { setFloorValve(6) }}, { xy: [.67, .74, .13, .22], fn: () => { setFloorValve(7) }},
        { xy: [.74, .8, .13, .22], fn: () => { setFloorValve(8) }}, { xy: [.8, .86, .13, .22], fn: () => { setFloorValve(9) }},
        { xy: [.86, .93, .13, .22], fn: () => { setFloorValve(10) }}, { pic: () => { return 'valve6-' + s.floorValve }}]},
    'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [{ pic: 'pipe2-2', if: () => { return s.pipe == 2 }},
        { xy: [.92, .99, .31, .41], pic: () => { return s.valves[3] ? 'valve3-2' : null }, fn: () => { flipValve(3) }},
        { pic: 'valve1-mini', if: () => { return s.valves[1] }},
        { pic: 'valve2-mini', if: () => { return s.valves[2] }},
        { pic: 'heaterMeter', scale: 2, offset: () => 
            { return [.37 - (.008 * (s.heaterLevel / 100)), .357 + (.2 * (s.heaterLevel / 100))] }}]},
    'A3': { left: 'A2', right: 'A4', boxes: [
        { xy: [.01, .1, .4, .5], pic: () => { return s.valves[3] ? 'valve3' : null }, fn: () => { flipValve(3) }},
        { xy: [.33, .4, .77, .86], pic: () => { return s.valves[4] ? 'valve4' : null }, fn: () => { flipValve(4) }},
        { xy: [.88, .95, .71, .8], pic: () => { return s.valves[5] ? 'valve5' : null }, fn: () => {  flipValve(5) }}, 
        { xy: [.25, .5, .86, 1], cursor: () => { return s.pipe == 3 ? 'F' : null }, 
            pic: () => { return s.pipe == 3 ? 'pipe3' : null }, id: 'pipe3',
            fn: () => { if (s.pipe == 3) { s.pipe = 0; refreshBoxes(); refresh() }}}]},
    'A4': { left: 'A3', right: 'A1', boxes: [{ to: 'A5', xy: [.15, .3, .08, .9]},
        { pic: 'valve5-mini', if: () => { return s.valves[5] }},
        { xy: [.6,.7,.25,.32], fn: () => { s.pipe = 0; refreshBoxes(); refresh()},
            pic: 'pipe1', if: () => { return s.pipe == 1 }}]},
    'A5': { forward: { to: 'cafe/A3', fn: () => { playSound('doorClose') }}, back: 'A4' },
    'B1': { left: 'B4', right: 'B2', boxes: [{ to: 'B5', xy: [.3, .5, .48, .65] }]},
    'B2': { left: 'B1', right: 'B3', boxes: [
        { xy: [.64, .69, .43, .5], pic: () => { return s.valves[1] ? 'valve1' : null }, fn: () => { flipValve(1) }},
        { xy: [.38, .57, .6, .71], cursor: () => { return s.pipe == 2 ? 'F' : null },
            pic: () => { return s.pipe == 2 ? 'pipe2' : null }, id: 'pipe2',
            fn: () => { if (s.pipe == 2) { s.pipe = 0 }; refreshBoxes(); refresh() }},
        { pic: 'heaterMeter', scale: 3, offset: () => 
            { return [.242 - (.019 * (s.heaterLevel / 100)), .016 + (.383 * (s.heaterLevel / 100))]}}]},
    'B3': { left: 'B2', right: 'B4', boxes: [{ to: 'B6', xy: [.15,.4,.2,.35] },
        { xy: [.53, .6, .49, .58], pic: () => { return s.valves[2] ? 'valve2' : null }, fn: () => { flipValve(2) }}]},
    'B4': { left: 'B3', right: 'B1', forward: 'A4', boxes: [
        { pic: () => { return s.valves[3] ? 'valve3-mini' : null }},
        { pic: 'pipe1-2', if: () => { return s.pipe == 1 }}]}, 
    'B5': { back: 'B1' }, 
    'B6': { back: 'B3' }
},
'stairs': { //zstairs
    'A1': { left: 'A4', right: 'A2', forward: { fn: () => { s.floor++; playSound('stairsUp')
        playGif('stairsMiddleUp2', 'C1', 9 * .15, () => { 
            if (s.floor == 10) { clearTimeout(waitId); playGif('stairsTopUp', 'B1', 10 * .15) }
            else playGif('stairsMiddleUp1', 'A1', 9 * .15) })}}},
    'A2': { left: 'A1', right: 'A3', forward: { to: 'hall/A7', fn: () => { s.hallDirection = 1; s.hallPosition = 2 }}, 
        boxes: [{ pic: () => { return 'floor' + s.floor }, offset: [.865, .91] }]},
    'A3': { left: 'A2', right: 'A4', forward: { fn: () => { s.floor--; playSound('stairsDown')
        playGif('stairsMiddleDown2', 'C1', 9 * .15, () => { playSound('stairsDown');
        if (s.floor == 1) playGif('stairsBottomDown', 'lobby/F2', 9 * .15)
        else playGif('stairsMiddleDown1', 'A3', 10 * .15) })}}},
    'A4': { left: 'A3', right: 'A1' },
    'B1': { left: 'B4', right: 'B2', forward: 'B5' },
    'B2': { left: 'B1', right: 'B3', boxes: [{ pic: 'floor10', offset: [.87, .98] }]},
    'B3': { left: 'B2', right: 'B4', forward: () => { if (s.coffee == 3) waitId = wait(60, () => { 
        s.coffee = 4; s.card = [s.floor, s.hallPosition, s.hallDirection] })
        s.floor--; playSound('stairsDown'); playGif('stairsTopDown', 'C1', 9 * .15, () => {
        playSound('stairsDown'); playGif('stairsMiddleDown1', 'A3', 10 * .15) })}},
    'B4': { left: 'B3', right: 'B1' },
    'B5': { back: 'B1', boxes: [{ to: 'B5a', fn: () => { playSound('drawer') }, xy: [.37, .52, .63, .78] }]},
    'B5a':{ back: { to: 'B1', fn: () => { playSound('drawer') }}, boxes: [
        { pic: 'card2', xy: [.03,.1,.5,.68], fn: () => { s.card = 0; refresh() }, if: cardHere},
        { pic: 'drawerCoffee', if: () => { return s.coffee == 3 }}, { pic: 'drawerNote', if: () => { return s.coffee == 4 }}]}},
'hall': { //zhall
    'A1': { left: { to: 'A5', fn: hallLeft }, right: { to: 'A5', fn: hallRight }, 
        forward: { to: 'A2', fn: hallForward }},
    'A2': { left: { fn: hallLeft, to: () => { return s.hallPosition == 2 ? 'A7' : (s.hallPosition == 6 ? 'A9' : 'A5')}},
        right: { fn: hallRight, to: () => { return s.hallPosition == 2 ? 'A6' : (s.hallPosition == 6 ? 'A8' : 'A5')}},
        forward: { fn: hallForward, to: 'A3' }},
    'A3': { left: { fn: hallLeft, to: () => { return s.hallPosition == 2 ? 'A6' : (s.hallPosition == 6 ? 'A8' : 'A5')}},
        right: { fn: hallRight, to: () => { return s.hallPosition == 2 ? 'A7' : (s.hallPosition == 6 ? 'A9' : 'A5')}},
        forward: {fn: hallForward, to: 'A4' }},
    'A4': { left: { fn: hallLeft, to: 'A5' }, right: { fn: hallRight, to: 'A5' }},
    'A5': { left: { fn: () => { hallLeft(); goTo(getHall(), LEFT) }}, right: { fn: () => { hallRight(); goTo(getHall(), RIGHT) }},
        boxes: [{ to: () => { return (is209() && cardHere()) ? 'A5a' : 'A10' }, fn: () => { if (is209() && cardHere()) playSound('doorOpen') }, xy: [.6, .67, .32, .45], 
            cursor: () => { return (is209() && cardHere()) ? 'O' : 'Z'}}, 
        { pic: 'card1', if: cardHere },
        { pic: () => { return 'roomFloor' + s.floor }, offset: [.44,.94]},
        { pic: () => { return 'room' + (s.hallPosition + (s.hallDirection == 1 ? 1 : 4) 
            + (s.hallPosition < 4 ? 0 : 2) - (s.hallPosition % 4 == 3 ? 1 : 0))}, offset: [.46,.94] }]},
    'A5a': { left: { fn: () => { playSound('doorClose'); hallLeft(); goTo(getHall(), LEFT) }}, 
        right: { fn: () => { playSound('doorClose'); hallRight(); goTo(getHall(), RIGHT) }},
        forward: 'room/A2', boxes: [{ pic: 'roomFloor2', offset: [.44,.94] }, { pic: 'room9', offset: [.46,.94] }]},
    'A6': { left: { fn: hallLeft, to: 'A2' }, right: { fn: hallRight, to: 'A3' }, forward: 'stairs/A4' },
    'A7': { left: { fn: hallLeft, to: 'A3' }, right: { fn: hallRight, to: 'A2' }, forward: 'B2'},
    'A8': { left: { fn: hallLeft, to: 'A2' }, right: { fn: hallRight, to: 'A3' }, forward: 'B4'},
    'A9': { left: { fn: hallLeft, to: 'A3' }, right: { fn: hallRight, to: 'A2' }},
    'A10': { back: 'A5', boxes: [
        { xy: [.46, .65, .6, .75], id: 'cardSlot', cursor: () => {
            return cardHere() ? 'O' : null }, fn: () => { s.card = 0; refresh() }},
        { xy: [.5, .72, .2, .35], fn: () => { makePic({ pic: 'doorHandle2', life: .5}); 
            if (is209()) { playSound('doorOpen'); goTo('A5a') }
            else playSound('doorHandle') }},
        { pic: 'card3', if: cardHere }]},
    'B1': { left: 'B4', right: 'B2', boxes: [outerElevatorBox, { xy: [.28, .31, .48, .52], 
        to: () => { if (s.floor == s.elevatorFloor) { return 'B1b' } else if (!s.elevatorFixed) return 'B1a' }, 
        fn: () => { if (s.floor == s.elevatorFloor || !s.elevatorFixed) { playSound('elevatorOpen') } else { callElevator() }}}]},
    'B1a': { left: { to: 'B4', fn: () => { playSound('elevatorClose') }}, right: { to: 'B2', fn: () => { playSound('elevatorClose') },
        boxes: [outerElevatorBox, { to: 'B1', fn: () => { playSound('elevatorOpen') }, xy: [.28, .31, .48, .52] },
        { to: 'B5', xy: [.35, .66, .17, .88] }]}},
    'B1b': { left: 'B4', right: 'B2', boxes: [outerElevatorBox,  { to: 'elevator/A1', xy: [.35, .66, .17, .88] },
        { to: 'B1', fn: () => { playSound('elevatorOpen') }, xy: [.28, .31, .48, .52] }]},
    'B2': { left: 'B1', right: 'B3', forward: { to: 'A9', fn: () => { s.hallDirection = 1; s.hallPosition = 6 }}},
    'B3': { left: 'B2', right: 'B4', boxes: [{ pic: () => { return 'floor' + s.floor}, offset: [.5,.74] }]},
    'B4': { left: 'B3', right: 'B1', forward: { to: 'A6', fn: () => { s.hallDirection = 3; s.hallPosition = 2 }}},
    'B5': { back: 'B1a' }},
'elevator': { //zelevator
    'A1': { left: () => { return s.elevatorFloor != s.elevatorGoal ? 'A2d' : (s.elevatorFloor == 1 ? 'A2a' : (s.elevatorFloor == 10 ? 'A2c' : 'A2b'))},
        right: () => { 
            return s.elevatorFloor != s.elevatorGoal ? 'A2d' : (s.elevatorFloor == 1 ? 'A2a' : (s.elevatorFloor == 10 ? 'A2c' : 'A2b'))}},
    'A2a': { left: 'A1', forward: { to: 'lobby/C3', fn: () => { playSound('elevatorClose') }}, boxes: elevatorBoxes },
    'A2b': { left: 'A1', forward: { to: 'hall/B3', fn: () => { playSound('elevatorClose') }}, boxes: elevatorBoxes },
    'A2c': { left: 'A1', forward: { to: 'top/A3', fn: () => { playSound('elevatorClose') }}, boxes: elevatorBoxes },
    'A2d': { left: 'A1', boxes: elevatorBoxes },
    'A3': { forward: { to: 'A3a', fn: () => { playSound('panel') }}, 
        back: () => { return s.elevatorMoving ? 'A2d' : (s.floor == 1 ? 'A2a' : (s.floor == 10 ? 'A2c' : 'A2b'))}},
    'A3a': { back: { to: () => {return s.elevatorMoving ? 'A2d' : (s.floor == 1 ? 'A2a' : (s.floor == 10 ? 'A2c' : 'A2b'))},
         fn: () => { playSound('panel') }}, boxes: [
        { pic: () => { return 'elevatorLight' + (s.elevatorFixed ? 'Green' : 'Red') }, offset: [.47, .96] },
        { xy: [.25, .35, .26, .32], offset: () => { return [[.26, .32], [.295, .32], [.33, .32]][s.circuits[0]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[0] = (s.circuits[0] + 1) % 3; checkCircuits() }},
        { xy: [.38, .5, .22, .27], offset: () => { return [[.385, .28], [.42, .28], [.45, .28], [.487, .28]][s.circuits[1]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[1] = (s.circuits[1] + 1) % 4; checkCircuits() }},
        { xy: [.51, .61, .24, .29], offset: () => { return [[.513, .3], [.56, .3], [.6, .3]][s.circuits[2]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[2] = (s.circuits[2] + 1) % 3; checkCircuits() }},
        { xy: [.645, .71, .2, .25], offset: () => { return [[.65, .25], [.695, .25]][s.circuits[3]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[3] = (s.circuits[3] + 1) % 2; checkCircuits() }},
        { xy: [.38, .47, .48, .55], offset: () => { return [[.383, .55], [.42, .55], [.453, .55]][s.circuits[4]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[4] = (s.circuits[4] + 1) % 3; checkCircuits() }},
        { xy: [.57, .61, .5, .56], offset: () => { return [[.57, .56], [.6, .56]][s.circuits[5]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[5] = (s.circuits[5] + 1) % 2; checkCircuits() }},
        { xy: [.69, .74, .61, .68], offset: () => { return [[.695, .676], [.727, .676]][s.circuits[6]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[6] = (s.circuits[6] + 1) % 2; checkCircuits() }},
        { xy: [.62, .71, .81, .87], offset: () => { return [[.625, .87], [.66, .87], [.695, .87]][s.circuits[7]]},
            pic: 'circuit', scale: 1, fn: () => { s.circuits[7] = (s.circuits[7] + 1) % 3; refreshBoxes() }},
        { xy: [.655, .68, .5, .55], offset: () => { return [[.65, .51], [.65, .552]][s.circuits[8]]},
            pic: 'circuit2', scale: 4, fn: () => { s.circuits[8] = (s.circuits[8] + 1) % 2; checkCircuits() }},
        { xy: [.45, .5, .72, .8], offset: () => { return [[.455, .738], [.455, .796]][s.circuits[9]]},
            pic: 'circuit2', scale: 4, fn: () => { s.circuits[9] = (s.circuits[9] + 1) % 2; checkCircuits() }}]}},
'room': { //zroom
    'A1': { left: 'A4', right: 'A2', boxes: [{ xy: [.62, .73, .1, .25], id: 'goldKeyhole', 
        pic: () => { return s.goldKey == 4 ? 'goldKey' : null }, to: () => { if (s.goldKey == 4) return 'A1a' },
        fn: () => { playSound(s.goldKey == 4 ? 'doorOpen' : 'doorLocked') }}]},
    'A1a':{ left: { to: 'A4', fn: () => { playSound('doorClose') }}, right: { to: 'A2', fn: () => { playSound('doorClose') }},
            forward: { to: 'D1', fn: () => { playSound('doorClose') }}},
    'A2': { left: 'A1', right: 'A3', forward: 'B2', boxes: [{ pic: 'fire2', if: () => { return s.fire }}]},
    'A3': { left: 'A2', right: 'A4' },
    'A4': { left: 'A3', right: 'A1', forward: { to: 'hall/A5', fn: () => {
        playSound('doorClose'); s.hallDirection = 3; s.hallPosition = 7 }}},
    'B1': { left: 'B4', right: 'B2', forward: 'C1' },
    'B2': { left: 'B1', right: 'B3', boxes: [{ to: 'B5', xy: [.2, .37, .7, .9] },
        { to: 'B6', xy: [.43, .57, .57, .73] }, { to: 'B7', xy: [.55, .63, .35, .46] },
        { to: () => { return s.fire ? 'B8a' : 'B8' }, xy: [.6, .64, .18, .25] },
        { pic: () => { return s.fire ? 'fire1' : null }}]},
    'B3': { left: 'B2', right: 'B4' },
    'B4': { left: 'B3', right: 'B1', forward: 'A4' },
    'B5': { back: 'B2', forward: 'B5a' },
    'B5a':{ back: 'B2', boxes: [{ xy: [.25, .75, .25, .75], to: 'B5', id: 'pigWindow' }]},
    'B6': { back: 'B2' },
    'B7': { back: 'B2' },
    'B8': { back: 'B2', forward: { to: 'B8a', fn: () => { playSound('lightSwitch'); s.fire = true }}},
    'B8a':{ back: 'B2', forward: { to: 'B8', fn: () => { playSound('lightSwitch'); s.fire = false }}},
    'C1': { left: 'C4', right: 'C2' },
    'C2': { left: 'C1', right: 'C3', forward: 'C5' },
    'C3': { left: 'C2', right: 'C4', forward: 'B3' },
    'C4': { left: 'C3', right: 'C1', boxes: [{ to: 'C6', xy: [.41, .57, .71, .93], cursor: 'Z' },
        { if: () => { return s.pig == 1 }, xy: [.25, .35, .4, .53], fn: () => { s.pig = 0; refresh() }},
        { if: () => { return s.pig == 1 }, pic: 'pig' }]},
    'C5': { back: 'C2' },
    'C6': { back: 'C4' },
    'D1': { left: 'D4', right: 'D2', boxes: [{ xy: [.4, .6, .3, .5], to: 'D5' }]},
    'D2': { left: 'D1', right: 'D3', boxes: [
        //{ pic: 'mirror', offset: [.37, .98], id: 'mirror', style: () => { inRange(0, (2 * s.steamLevel) - 30, 60) + '%' }}
    ]},
    'D3': { left: 'D2', right: 'D4', boxes: [{ xy: [.35, .41, .31, .39], fn: () => { playSound('doorOpen'); goTo('D3a') }}]},
    'D3a': { left: { to: 'D2', fn: () => { playSound('doorClose') }}, right: { to: 'D4', fn: () => { playSound('doorClose') }},
            forward: { to: 'A3', fn: () => { playSound('doorClose') }}},
    'D4': { left: 'D3', right: 'D1', boxes: [
        { xy: [.39, .42, .44, .48], fn: () => { playSound('valve'); s.shower = 1; refreshBoxes() }},
        { xy: [.42, .45, .44, .48], fn: () => { playSound('valve'); s.shower = 0; refreshBoxes() }},
        { xy: [.45, .48, .44, .48], fn: () => { playSound('valve'); s.shower = 2; refreshBoxes(); showerStep() }},
        { if: () => { return s.shower != 0 }, pic: () => { return s.shower == 1 ? 'cold' : 'hot' }},
        // { mov: 'shower', steps: 7, delay: .075, fate: 'loop', if: () => { 
        //     return ((s.floorValve == 2 && s.shower == 1) || showerHot()) }}
        ]},
    'D5': { back: 'D1' },
    'persistents': [{ if: () => { return s.frame.startsWith('D') }, pic: 'steam/0', style: 'opacity: 0', id: 'steam' }]},
'top': {
    'A1': { left: 'A4', right: 'A2', boxes: [outerElevatorBox,
        { to: 'A1a', fn: () => { playSound('elevatorOpen') }, xy: [.28, .31, .48, .52]}]},
    'A1a': { left: { to: 'A4', fn: () => { playSound('elevatorClose') }}}, 
        right: { to: 'A2', fn: () => { playSound('elevatorClose') }, boxes: [outerElevatorBox,
        { to: 'A1', fn: () => { playSound('elevatorClose') }, xy: [.28, .31, .48, .52] },
        { to: 'elevator/A1', xy: [.35, .66, .17, .88] }]},
    'A2': { left: 'A1', right: 'A3' },
    'A3': { left: 'A2', right: 'A4', forward: 'B2' },
    'A4': { left: 'A3', right: 'A1' },
    'B1': { left: 'B2', right: 'B2', forward: 'A1' },
    'B2': { left: 'B1', right: 'B1', forward: 'C2' },
    'C1': { left: 'C2', right: 'C2', forward: 'B1' },
    'C2': { left: 'C1', right: 'C1', boxes: [{ to: 'C3', xy: [.6, .65, .51, .63] }]},
    'C2a':{ left: 'C1', right: 'C1', boxes: [
        { to: 'D3', fn: () => { playSound('doorClose') }, xy: [.35, .65, .22, .82] }]},
    'C3': { boxes: keypadButtons, back: 'C2' },    
    'D1': { left: 'D4', right: 'D2', boxes: [{ xy: [.4, .6, .3, .75], to: 'C1', fn: () => { playSound('doorOpen') }}]},
    'D2': { left: 'D1', right: 'D3', onEnter: () => { if (s.bobbSpeech) return 
        freeze(); wait(1, () => { goTo('D5'); setMusic(null);
            wait(305, () => { s.bobbSpeech = true; s.otherLeft = false; goTo('D2'); unfreeze() })})}},
    'D3': { left: 'D2', right: { to: 'D4' }, 
        boxes: [{ xy: [.57, .61, .44, .49], fn: () => { playSound('doorLocked'); return
        // doInSequence([
        //     () => { freeze(); setMusic(null); playSound('music/end'); hideInventory(); playGif('exit6', 'D6') }, 2,
        //     () => { setFade(7); goTo('E1') }, 5,
        //     () => { let scream = playSound('scream'); playGif('fall', 'E2'); 
        //         wait(4.2, () => { scream.pause(); playSound('splat'); goTo('credits/1') })}])
        }}]},
    'D4': { left: 'D3', right: 'D1' }},
'credits': {
    1: { onEnter: () => { setFade(4);
        doInSequence([ 4, 
            () => { goTo(2) }, 3, () => { goTo(3) }, 3, () => { goTo(4) }, 4, () => { goTo(5) }, 4, 
            () => { goTo(6) }, 4, () => { goTo(7) }, 4, () => { goTo(8) }, 4, () => { setFade(.2) }, .2, 
            () => { goTo(9) }, .2, () => { goTo(10) }, () => { goTo(11) }, .2, () => { goTo(12) }, .2,
            () => { goTo(13) }, .2, () => { goTo(14) }, .2, () => { goTo(15) }, .2, () => { goTo(16) }, .2, 
            () => { goTo(17) }, .2, () => { goTo(18) }, .2, () => { goTo(19) }, 3, () => { goTo(20); setFade(20) }, 5,
            () => { goTo('top/D6'); setMusic(null) }, 20, () => { goTo('opening/A1') }
        ])
}}}}

function showerStep() { //TODO - this should be triggered by any potential change? or, just never stop?
    if (s.steamLevel == 0 && !showerHot()) return
    wait(.2, () => { let steam = get('steam'); let mirror = get('mirror')
        if (showerHot()) { s.steamLevel = Math.min(s.steamLevel + 1, 70); s.heaterLevel = Math.max(s.heaterLevel - 1, 0) }
        else s.steamLevel = Math.max(s.steamLevel - 1, 0)
        if (mirror != null) mirror.style.opacity = inRange(0, (2 * s.steamLevel) - 30, 60) + '%'
        if (steam != null) { steam.src = PIC_PATH + '/steam/' + Math.floor(Math.random() * 9) + '.png'; 
            steam.style.opacity = s.steamLevel + '%' }
        showerStep() })}

function inRange(min, val, max) { return val < min ? min : (val > max ? max : val) }

function showerHot() { return s.heaterLevel > 0 && s.floorValve == 2 && s.valves[2] && !s.valves[4] && s.valves[5] && s.shower == 2 }

function clockOn() { wait(10, () => {
    s.clock1 = (s.clock1 + 1) % 360
    if (s.clock1 % 12 == 0) s.clock2 = (s.clock2 + 1) % 360
    if (s.clock1 == 0 && s.clock2 == 0) { // todo - vary volume, elevator, plumbingroom... vary # of dings???
        if (s.room == 'lobby' || s.room == 'pool' || s.room == 'clockroom') playSound('clock')
        s.cafeUnlocked = true }
    if (s.frame == 'E4' && s.room == 'lobby') refreshBoxes()
    clockOn() })}

// TODO: store variants as separate var? some level of indirection beyond frame and image.

///////// HELPERS
function checkCircuits() {
    //s.elevatorFixed = (s.circuits[0] == 2 && s.circuits[1] == 0 && s.circuits[2] == 0 && s.circuits[3] == 1 
    //    && s.circuits[4] == 1 && s.circuits[5] == 0 && s.circuits[6] == 1 && s.circuits[8] == 0 && s.circuits[9] == 1)
    refreshBoxes() }

function changeDrawer(n) {
    s.drawers[n] = !s.drawers[n]
    if (s.drawers[0] && s.drawers[1] && s.drawers[2] && s.drawers[3]) {
        playSound('cabinetDown2'); s.lightsOn = false; s.cabinetDown = true }
    refreshBoxes() }

function pushKeypad(n) {
    playSound('beep'); combo.push(n); if (combo.length > 5) combo.shift()
    if (s.room == 'pool' && comboIs([3, 5, 2, 9, 9])) { playSound('doorOpen'); goTo('A3a'); s.clockUnlocked = true }
    else if (s.room == 'cafe' && comboIs([8, 7, 0, 1, 2])) { playSound('doorOpen'); goTo('A1a'); s.plumbUnlocked = s.plumbOpen = true }
    else if (true) { goTo('C2'); freeze(); setMusic(null);
        wait(1, () => { s.officeUnlocked = true; goTo('C2a'); playSound('doorOpen'); unfreeze() })}}

function comboIs(goal) { for (i in goal) { if (combo[i] != goal[i]) return false } return true }

function saladButton(n) { playSound('button'); if (s.salads[n] > 0) { playSound('slurp'); s.salads[n]-- }}

function flipValve(n) { playSound('valve'); s.valves[n] = !s.valves[n]; refreshBoxes() }

function setFloorValve(n) { playSound('valve'); s.floorValve = n; refreshBoxes() }

function hallLeft() { s.hallDirection = s.hallDirection == 0 ? 3 : s.hallDirection - 1 }

function hallRight() { s.hallDirection = s.hallDirection == 3 ? 0 : s.hallDirection + 1 }

function hallForward() { s.hallPosition += (s.hallDirection == 0 ? 1 : -1) }

function getHall() {
    switch (s.hallPosition % 4) {
        case 0: return s.hallDirection == 0 ? 'A1' : 'A4'
        case 1: return s.hallDirection == 0 ? 'A2' : 'A3'
        case 3: return s.hallDirection == 0 ? 'A4' : 'A1' }}

function cardHere() { return s.card[0] == s.floor && s.card[1] == s.hallPosition && s.card[2] == s.hallDirection }

function is209() { return s.floor == 2 && s.hallPosition == 7 && s.hallDirection == 1 }

function callElevator() {
    if (!s.elevatorFixed) return
    s.elevatorGoal = s.floor
    if (s.elevatorMoving) return
    moveElevator() }

function setElevatorFloor(newFloor) {
    playSound('button'); if (!s.elevatorFixed || newFloor == s.elevatorFloor) return
    s.elevatorGoal = newFloor; if (s.elevatorMoving) return
    s.elevatorMoving = true; playSound('elevatorClose'); goTo('A2d')
    wait(2, () => { moveElevator() })}

function openElevator() {
    if (s.room == 'elevator') { playSound('elevatorOpen')
        if (s.frame == 'A2d') goTo(s.elevatorFloor == 1 ? 'A2a' : (s.elevatorFloor == 10 ? 'A2c' : 'A2b')) }
    else if (s.elevatorFloor == s.floor) {
        if (s.room == 'lobby' && (s.frame == 'C1' || s.frame == 'C1a')) { playSound('elevatorOpen'); goTo('C1b') }
        else if (s.room == 'hall' && (s.frame == 'B1' || s.frame == 'B1a')) { playSound('elevatorOpen'); goTo('B1b') }}
    s.elevatorMoving = false }


// THREADS

function moveElevator() {
    s.elevatorMoving = true
    if (!s.elevatorFixed) { openElevator(); return }
    if (s.room == 'elevator') playSound('elevatorBell')
    wait(2, () => { 
        s.elevatorFloor += (s.elevatorGoal > s.elevatorFloor ? 1 : -1)
        if (s.room == 'elevator') s.floor = s.elevatorFloor
        refreshBoxes()
        if (s.elevatorGoal == s.elevatorFloor) { openElevator(); return }
        moveElevator() })}

