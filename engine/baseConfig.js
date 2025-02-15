let baseConfig = {
	title: 'Game',
	width: 750,
	height: 750,
	sideSpeed: .3,
	fadeSpeed: 1,
	customCursors: false,
    defaultCursor: 'N',
	waitCursor: 'S',
	baseBox: {	
		cursor: 'O',
		transition: FADE },
	commonBoxes: {
		left: { xy: [0, .2, .2, .8], transition: LEFT, cursor: 'L' },
		right: { xy: [.8, 1, .2, .8], transition: RIGHT, cursor: 'R' },
		forward: { xy: [.25, .75, .25, .75], transition: FADE, cursor: 'F' },
		back: { xy: [0, 1, 0, .2], transition: FADE, cursor: 'B' }},
	boxOffset: [0, 0],
	baseInventory: {
		cursor: 'O'
	}
}