//Draw a tile on screen
const DRAW_TILE = 'drawtile';
//Draw tile end on screen
const DRAW_TILE_BR = 'drawtilebr';
//Draw mine
const DRAW_MINE = 'drawmine';
//Draw safe
const DRAW_SAFE = 'drawsafe';
//Mark as mine
const MARK = 'mark';
//Unmark
const UNMARK = 'unmark';
//Click tile
const SHOW_TILE = 'showtile'

//Get event for DRAW_TILE
function get_DRAW_TILE_event(x, y) {
	return new CustomEvent(DRAW_TILE, {
		detail: {
			x: x,
			y: y
		}
	});
}

//Get event for DRAW_TILE_BR
function get_DRAW_TILE_BR_event() {
	return new CustomEvent(DRAW_TILE_BR, {
		detail: {}
	});
}

//Get event for DRAW_MINE
function get_DRAW_MINE_event(x, y) {
	return new CustomEvent(DRAW_MINE, {
		detail: {
			x: x,
			y: y
		}
	});
}

//Get event for DRAW_SAFE
function get_DRAW_SAFE_event(x, y, surrounding) {
	return new CustomEvent(DRAW_SAFE, {
		detail: {
			x: x,
			y: y,
			surrounding: surrounding
		}
	});
}

//Get event for MARK
function get_MARK_event(x, y) {
	return new CustomEvent(MARK, {
		detail: {
			x: x,
			y: y
		}
	});
}

//Get event for UNMARK
function get_UNMARK_event(x, y) {
	return new CustomEvent(UNMARK, {
		detail: {
			x: x,
			y: y
		}
	});
}

//Get event for SHOW_TILE
function get_SHOW_TILE_event(x, y, mark_mode) {
	return new CustomEvent(SHOW_TILE, {
		detail: {
			x: x,
			y: y,
			mark_mode: mark_mode
		}
	});
}