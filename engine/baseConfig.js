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
		transition: 'fade' },
	commonBoxes: {
		left: { xy: [0, .2, .2, .8], transition: 'left', cursor: 'L' },
		right: { xy: [.8, 1, .2, .8], transition: 'right', cursor: 'R' },
		forward: { xy: [.25, .75, .25, .75], transition: 'fade', cursor: 'F' },
		back: { xy: [0, 1, 0, .2], transition: 'fade', cursor: 'B' }},
	boxOffset: [0, 0],
	baseInventory: {
		cursor: 'O'
	}
}