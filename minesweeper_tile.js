//Minesweeper tile
var __MinesweeperTile = function(x, y, mine, surrounding_mines) {
	//Tile is hidden
	const HIDDEN = 0;
	//Tile is shown
	const SHOWN = 1;
	//Tile is marked
	const MARKED = 2;
	
	this.x = x;
	this.y = y;
	this.mine = mine;
	this.surrounding_mines = surrounding_mines;
	this.state = HIDDEN;
	
	//Is tile shown
	__MinesweeperTile.prototype.is_shown = function() {
		return this.state == SHOWN;
	}
	//Is tile marked
	__MinesweeperTile.prototype.is_marked = function() {
		return this.state == MARKED;
	}
	
	//Show a tile on DOM
	__MinesweeperTile.prototype.show = function(mark_mode) {
		//Mark mode
		if (mark_mode) {
			//Mark tile
			if (this.state == HIDDEN) {
				this.state = MARKED;
				window.dispatchEvent(get_MARK_event(this.x, this.y));
			}
			//Unmark tile
			else if (this.state == MARKED) {
				this.state = HIDDEN;
				window.dispatchEvent(get_UNMARK_event(this.x, this.y));
			}
		}
		//Show tile
		else if (this.state == HIDDEN) {
			this.state = SHOWN;
			//Show mine
			if (this.mine) {
				window.dispatchEvent(get_DRAW_MINE_event(this.x, this.y));
			}
			//Show safe
			else {
				window.dispatchEvent(get_DRAW_SAFE_event(this.x, this.y, this.surrounding_mines));
			}
		}
	}
}