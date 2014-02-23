//Create a minesweeper board of dimensions (width x height) and #mines = num_mines
var Minesweeper = function(width, height, num_mines) {
	//From arguments
	this.width = width;
	this.height = height;
	this.num_mines = num_mines;
	
	//Members
	this.board = this.create_board();
	this.num_marked = 0;
	this.marked = {};

	//Draw
	this.draw_board();

	//Click event listeners
	this.attach_click_event_listeners_to_tiles();
}

//Create board with tiles
Minesweeper.prototype.create_board = function() {
	var size = this.width * this.height;
	if (this.num_mines > size) {
		console.log("Number of mines exceeds board size.");
		this.num_mines = size;
	}
	
	var board = [];
	var mines = get_random_numbers(this.num_mines, size);
	
	//Populate board
	for (var i=0; i<this.height; i++) {
		var line = []
		for (var j=0; j<this.width; j++) {
			var mine = (mines.indexOf(i*this.height + j)>=0);
			var surrounding_mines = 0;
			
			//Count surrounding mines
			if (i>0 && mines.indexOf((i-1)*this.height + j)>=0) surrounding_mines++;									//Up
			if (i>0 && j<this.width-1 && mines.indexOf((i-1)*this.height + j+1)>=0) surrounding_mines++;				//Up-Right
			if (j<this.width-1 && mines.indexOf(i*this.height + j+1)>=0) surrounding_mines++;							//Right
			if (j<this.width-1 && i<this.height-1 && mines.indexOf((i+1)*this.height + j+1)>=0) surrounding_mines++;	//Down-Right
			if (i<this.height-1 && mines.indexOf((i+1)*this.height + j)>=0) surrounding_mines++;						//Down
			if (j>0 && i<this.height-1 && mines.indexOf((i+1)*this.height + j-1)>=0) surrounding_mines++;				//Down-Left
			if (j>0 && mines.indexOf(i*this.height + j-1)>=0) surrounding_mines++;										//Left
			if (i>0 && j>=0 && mines.indexOf((i-1)*this.height + j-1)>=0) surrounding_mines++;							//Up-Left
			
			line.push(new __MinesweeperTile(j, i, mine, surrounding_mines));
		}
		board.push(line);
	}
	return board;
	
	//Generate a set of n random numbers, from within a set of size s
	function get_random_numbers(n, s) {
		var rands = [];
		for (var i=0; i<n; i++) {
			var rand = parseInt(Math.random() * s) % s;
			while (rands.indexOf(rand) >= 0) rand = (rand+1)%s;
			rands.push(rand);
		}
		
		return rands;
	}
}

//Draw board
Minesweeper.prototype.draw_board = function() {
	var obj = this;
	for (var i=0; i<this.height; i++) {
		for (var j=0; j<this.width; j++) draw_tile(this.board[i][j], j, i);
		window.dispatchEvent(get_DRAW_TILE_BR_event());
	}
	
	//Draw tile
	function draw_tile(tile, x, y) {
		window.dispatchEvent(get_DRAW_TILE_event(x, y));
	}
}

//Attach click event listeners to tiles
Minesweeper.prototype.attach_click_event_listeners_to_tiles = function() {
	var obj = this;
	
	window.addEventListener(SHOW_TILE, function(e) {
		var x = parseInt(e.detail.x);
		var y = parseInt(e.detail.y);
		var mark_mode = parseInt(e.detail.mark_mode);
		
		var tiles_to_show = [obj.board[y][x]];

		while (tiles_to_show.length > 0) {
			var tile = tiles_to_show.pop();
			console.log(tile);
			tile.show(mark_mode);

			//Maintain marked tiles
			if (mark_mode) {
				var key = y*obj.height + x;
				if (tile.is_marked()) {
					obj.num_marked++;
					obj.marked[key] = true;
					
					if (obj.num_marked == obj.num_mines) {
						obj.check_all_marked();
					}
				}
				else {
					obj.marked[key] = null;
					obj.num_marked--;
				}
			}
			
			if (mark_mode || tile.is_marked()) continue;
			
			//Check if end game
			if (tile.mine) 
				obj.end_game();
			//Uncover surrounding tiles if this tile has no adjacent mines and surrounding tiles have no adjacent mines
			else {
				if (tile.surrounding_mines == 0) {
					var tiles = obj.get_surrounding_tiles(tile);
					for (var i=0; i<tiles.length; i++) 
						if (!tiles[i].is_shown()) tiles_to_show.push(tiles[i]);
				}
			}
		}
	});
	
	//Click tile
	function click_tile(e) {
		//Shift+Click to mark mine
		var mark_mode = e.shiftKey;
		
		var elt_tile = e.srcElement;
		var x = parseInt(elt_tile.getAttribute('x'));
		var y = parseInt(elt_tile.getAttribute('y'));
		
				
	}
}

//Get surrounding tiles
Minesweeper.prototype.get_surrounding_tiles = function(tile) {
	var x = tile.x;
	var y = tile.y;
	
	var tiles = [];
	
	//Up
	if (y>0) tiles.push(this.board[y-1][x]);
	//Up-Right
	if (x<this.width-1 && y>0) tiles.push(this.board[y-1][x+1]);
	//Right
	if (x<this.width-1) tiles.push(this.board[y][x+1]);
	//Right-Down
	if (x<this.width-1 && y<this.height-1) tiles.push(this.board[y+1][x+1]);
	//Down
	if (y<this.height-1) tiles.push(this.board[y+1][x]);
	//Down-Left
	if (x>0 && y<this.height-1) tiles.push(this.board[y+1][x-1]);
	//Left
	if (x>0) tiles.push(this.board[y][x-1]);
	//Left-Up
	if (x>0 && y>0) tiles.push(this.board[y-1][x-1]);

	return tiles;
}

//Check if all mines are marked
Minesweeper.prototype.check_all_marked = function() {
	var found = 0;
	for (var i=0; i<this.height; i++) {
		for (var j=0; j<this.width; j++) {
			var tile = this.board[i][j];
			if (tile.mine) {
				var key = i*this.height + j;
				if (this.marked[key]) found++
			}
		}
	}
	
	if (found == this.num_mines) this.win_game();
}

//Win game
Minesweeper.prototype.win_game = function() {
	console.log('You Win');
	
	//Disable all tiles
	var tiles = document.getElementsByClassName('tile');
	for (var i=0; i<tiles.length; i++) tiles[i].disabled = true;
}

//End game
Minesweeper.prototype.end_game = function() {
	console.log('Game Over');
	
	//Disable all tiles
	var tiles = document.getElementsByClassName('tile');
	for (var i=0; i<tiles.length; i++) tiles[i].disabled = true;
}