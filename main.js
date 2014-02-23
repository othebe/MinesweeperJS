//Read input and show game on screen
function start() {
	var width = document.getElementById('input-width').value;
	var height = document.getElementById('input-height').value;
	var mines = document.getElementById('input-mines').value;
	
	//Parse for correctness
	if (width != parseInt(width) && height != parseInt(height) && mines != parseInt(mines)) {
		alert('Error in input');
	} else {
		document.getElementById('board').innerHTML = '';
		
		var m = new Minesweeper(width, height, mines);
		
		document.getElementById('total-mines').innerHTML = m.num_mines;
		document.getElementById('remaining-mines').innerHTML = m.num_mines;
		
		//Disable all tiles
		var tiles = document.getElementsByClassName('tile');
		for (var i=0; i<tiles.length; i++) tiles[i].disabled = false;
	}
}

//Get tile by x,y
function get_tile(x, y) {
	var elt_tiles = document.getElementsByClassName('tile');
	for (var i=0; i<elt_tiles.length; i++) {
		var elt_tile = elt_tiles[i];
		if (elt_tile.getAttribute('x')==x && elt_tile.getAttribute('y')==y) return elt_tile;
	}
}

window.onload = function() {
	const ELT_BOARD = document.getElementById('board');
	
	//DRAW_TILE
	window.addEventListener(DRAW_TILE, function(e) {
		var x = e.detail.x;
		var y = e.detail.y;
		
		var elt_tile = document.createElement('button');
		elt_tile.setAttribute('class', 'tile');
		elt_tile.setAttribute('x', x);
		elt_tile.setAttribute('y', y);
		elt_tile.onclick = function(e) { window.dispatchEvent(get_SHOW_TILE_event(x, y, (e.shiftKey)?1:0)); }
		
		ELT_BOARD.appendChild(elt_tile);
	});
	
	//DRAW_TILE_BR
	window.addEventListener(DRAW_TILE_BR, function(e) {
		ELT_BOARD.appendChild(document.createElement('br'));
	});
	
	//DRAW_MINE
	window.addEventListener(DRAW_MINE, function(e) {
		var x = e.detail.x;
		var y = e.detail.y;
		
		var elt = get_tile(x, y);
		elt.setAttribute('class', 'tile mine');
		elt.innerHTML = '';
	});
	
	//DRAW_SAFE
	window.addEventListener(DRAW_SAFE, function(e) {
		var x = e.detail.x;
		var y = e.detail.y;
		var surrounding_mines = e.detail.surrounding;
		
		var elt = get_tile(x, y);
		elt.setAttribute('class', 'tile safe');
		elt.disabled = true;
		if (surrounding_mines > 0) elt.innerHTML = surrounding_mines;
	});
	
	//MARK
	window.addEventListener(MARK, function(e) {
		var x = e.detail.x;
		var y = e.detail.y;
		
		var elt = get_tile(x, y);
		elt.setAttribute('class', 'tile mark');
		elt.innerHTML = '*';
		
		document.getElementById('remaining-mines').innerHTML = parseInt(document.getElementById('remaining-mines').innerHTML)-1;
	});
	
	//UNMARK
	window.addEventListener(UNMARK, function(e) {
		var x = e.detail.x;
		var y = e.detail.y;
		
		var elt = get_tile(x, y);
		elt.setAttribute('class', 'tile');
		elt.innerHTML = '';
		
		document.getElementById('remaining-mines').innerHTML = parseInt(document.getElementById('remaining-mines').innerHTML)+1;
	});
}