function Brood(game, color) {
    this.game = game;
    this.color = color;
    this.rgb = hexToRgb(color);
    this.cells = [];

    this.ownCell = function(cell) {
        // Add to our cells
        this.cells.push(cell);
    };
    // Cells must have their broods set properly again after this
    this.disownCell = function(cell) {
        // console.log('length preremoval:', this.cells.length);
        _.pull(this.cells, cell);
        // console.log('length postremoval:', this.cells.length);
    };
    this.game.broods.push(this);

    console.log('Brood created with ' + this.color + '!');
    console.log(this);
}

/**
 * Parent Score
 * High Score is more likely to be parent
 * @param hexColor
 */
Brood.prototype.parentScore = function (hexColor) {
    var rgb = hexToRgb(hexColor);
    var rdiff = Math.abs(rgb.r - this.rgb.r);
    var gdiff = Math.abs(rgb.g - this.rgb.g);
    var bdiff = Math.abs(rgb.b - this.rgb.b);
    return (255 * 3) - rdiff - gdiff - bdiff;
};

