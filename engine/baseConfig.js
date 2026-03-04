let baseConfig = {
	title: 'Game',
	width: 750,
	height: 750,
	sideSpeed: .3,
	fadeSpeed: 1,
	customCursors: false,
	useCursorImg: false,
    defaultCursor: 'N',
	waitCursor: 'S',
	baseBox: {	
		cursor: 'O',
		transition: FADE },
	commonBoxes: {
		left: 		{ xy: [0, .25, .2, .75], 	transition: LEFT, 	cursor: 'L' },
		right: 		{ xy: [.75, 1, .2, .75], 	transition: RIGHT, 	cursor: 'R' },
		forward: 	{ xy: [.25, .75, .2, .75], 	transition: FADE, 	cursor: 'F' },
		back: 		{ xy: [0, 1, 0, .2], 		transition: FADE, 	cursor: 'B' }},
	boxOffset: [0, 0],
	baseInventory: {
		cursor: 'O'
	}
}