let baseConfig = {
	title: 'Game',
	width: 750,
	height: 750,
	sideSpeed: .3,
	fadeSpeed: 1,
    waitCursor: 'S',
    defaultCursor: 'N',
	baseBox: {	
		cursor: 'O',
		transition: 'fade' },
	standardBoxes: {
		left: { xy: [0, .2, .2, .8], transition: 'left', cursor: 'L', id: 'leftBox' },
		right: { xy: [.8, 1, .2, .8], transition: 'right', cursor: 'R', id: 'rightBox' },
		forward: { xy: [.25, .75, .25, .75], transition: 'fade', cursor: 'f', id: 'forwardBox' },
		back: { xy: [0, 1, 0, .2], transition: 'fade', cursor: 'b', id: 'backBox' }}
}