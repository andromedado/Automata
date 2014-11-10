// Cell objects are ignorant of their x and y position--
// they merely access surrounding spaces, which can also
// have entities.
function Cell(game, brood, space, moved) {
    this.brood = brood;
    this.game  = game;
    this.space = space;
    // Indicates that this cell has not already moved,
    // divided, conquered, etc. this turn
    if (typeof moved === 'undefined') {
        this.moved = false;
    } else {
        this.moved = true;
    }
    this.view = new CellView(game, this);
    this.turnsSinceBroodChange = 0;
}
Cell.prototype.draw = function() {
    this.view.draw();
};
Cell.prototype.show = function() {
    this.view.show();
};
Cell.prototype.hide = function() {
    this.view.hide();
};
// Set space
Cell.prototype.setSpace = function(space) {
    this.space = space;
};

Cell.prototype.setColor = function (color){
    this.color = color;
    this.view.setColor(color);
};

Cell.prototype.beats = function (opponentCell) {
    var affinityDiff = this.broodAffinity() - opponentCell.broodAffinity();
    var luminosityDiff = this.getLuminosity() - opponentCell.getLuminosity();
    luminosityDiff *= this.game.powerOfLuminosity;
    return (affinityDiff + luminosityDiff) > 0;
    if (Math.abs(affinityDiff) > this.game.parentTolerance) {
        thisCellWins = affinityDiff > this.game.parentTolerance;
    }
    return Math.random() > 0.5;
};

Cell.prototype.getLuminosity = function () {
    var rgb = hexToRgb(this.color || this.brood.color);
    return rgb.r + rgb.g + rgb.b;
};

Cell.prototype.broodAffinity = function () {
    return this.brood.parentScore(this.color || this.brood.color);
};

// Set parent brood. TODO: unset from other brood parents!!
Cell.prototype.setBrood = function(brood, surroundings) {
    this.brood.disownCell(this);
    this.brood = brood;
    this.brood.ownCell(this);
    this.setColor(avgColors([surroundings.avgColor.hex, brood.color]).hex);
    this.turnsSinceBroodChange = 0;
};
// Returns the cells surrounding this cell,
// as well as a count of the number of broods
// in the area
Cell.prototype.getSurroundingCells = function() {
    var colors = [];
    var surroundingCells = {
        cells: {},
        broods: {}
    };
    var rightSpace = this.space.getRightSpace();
    var leftSpace = this.space.getLeftSpace();
    var bottomSpace = this.space.getBottomSpace();
    var topSpace = this.space.getTopSpace();

    if (rightSpace) {
        surroundingCells.cells.right = rightSpace.cell;
        colors.push(rightSpace.cell.color || rightSpace.cell.brood.color);
    }
    if (leftSpace) {
        surroundingCells.cells.left = leftSpace.cell;
        colors.push(leftSpace.cell.color || leftSpace.cell.brood.color);
    }
    if (bottomSpace) {
        surroundingCells.cells.bottom = bottomSpace.cell;
        colors.push(bottomSpace.cell.color || bottomSpace.cell.brood.color);
    }
    if (topSpace) {
        surroundingCells.cells.top = topSpace.cell;
        colors.push(topSpace.cell.color || topSpace.cell.brood.color);
    }
    surroundingCells.avgColor = avgColors(colors, Math.random());

    // Strip out empty surroundings
    for (var i in surroundingCells.cells) {
        if (!surroundingCells.cells[i]) delete surroundingCells.cells[i];
    }

    // Accumulate count of cell broods in broods property
    for (var i in surroundingCells.cells) {
        // Don't count own broods in owners
        if (surroundingCells.cells[i].brood == this.brood) continue;
        if (surroundingCells.broods[surroundingCells.cells[i].brood.color]) {
            surroundingCells.broods[surroundingCells.cells[i].brood.color]++;
        } else {
            surroundingCells.broods[surroundingCells.cells[i].brood.color] = 1;
        }
    }
    return surroundingCells;
};
// Gets a random, unoccupied neighbor space
Cell.prototype.getRandomUnoccupiedNeighbor = function() {
    var surroundingSpaces = this.space.getNeighborhood();
    // delete surroundingSpaces.center;
    // delete surroundingSpaces.topLeft;
    // delete surroundingSpaces.topRight;
    // delete surroundingSpaces.bottomLeft;
    // delete surroundingSpaces.bottomRight;

    var unoccupiedSpaces = [];
    for (var i in surroundingSpaces) {
        // If we found a space (case for edges of grid) and it
        // doesn't have a cell, we know it's an unoccupied space
        if (surroundingSpaces[i] && !surroundingSpaces[i].cell) {
            unoccupiedSpaces.push(surroundingSpaces[i]);
        }
    }
    if (unoccupiedSpaces.length > 0) {
        var rand = unoccupiedSpaces[randomInt(unoccupiedSpaces.length)];
        return rand;
    }
    // implicit undefined return
};