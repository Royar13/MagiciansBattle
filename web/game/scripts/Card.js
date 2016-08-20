function Card() {

}

Card.prototype.setSquare = function (square) {
    if (this.square != null) {
        this.square.unsetCard();
    }
    this.square = square;
    this.square.setCard(this);
};

Card.prototype.create = function (square) {
    this.setSquare(square);
    this.container = new createjs.Container();
    this.squareImage = new createjs.Bitmap(game.loader.getItem("magician"));
    this.squareImage.setWidth(this.square.getWidth() / 2.5);
    this.update();
    this.container.addChild(this.squareImage);
    stage.addChild(this.container);
};

Card.prototype.showLegalMoves = function () {
    this.legalMoves = this.getLegalMoves();
    for (var i in this.legalMoves) {
        var square = this.legalMoves[i];
        square.showLegalMove();
    }
    game.updateStage();
};

Card.prototype.getLegalMoves = function () {
    var squares = this.square.map.squares;
    var infinity = 1 / 0;
    var orderedSquares = new Array();
    for (var y in squares) {
        for (var x in squares[y]) {
            squares[y][x].distance = infinity;
            squares[y][x].movementCost = 1;
            orderedSquares.push({ x: x, y: y });
        }
    }
    this.square.distance = 0;
    var maxDistance = 3;
    var moves = new Array();

    while (orderedSquares.length > 0) {
        orderedSquares.sort(function (a, b) {
            return squares[a.y][a.x].distance - squares[b.y][b.x].distance;
        });
        var closestSquare = squares[orderedSquares[0].y][orderedSquares[0].x];
        orderedSquares.splice(0, 1);
        if (closestSquare.distance <= maxDistance) {
            if (closestSquare !== this.square)
                moves.push(closestSquare);
        }
        else {
            return moves;
        }
        for (var i in closestSquare.access) {
            var access = closestSquare.access[i];
            if (access != null) {
                var neighborSquare = squares[access.y][access.x];
                var alt = closestSquare.distance + neighborSquare.movementCost;
                if (alt < neighborSquare.distance) {
                    neighborSquare.distance = alt;
                    neighborSquare.prev = closestSquare;
                }
            }
        }
    }
    return moves;
};

Card.prototype.moveToSquare = function (square) {
    var tween = createjs.Tween.get(this.container);
    var path = new Array();
    var addStep = square;
    do {
        path.unshift(addStep);
        addStep = addStep.prev;
    } while (addStep !== this.square);
    this.setSquare(square);
    for (var i in path) {
        var pos = this.getPosition(path[i]);
        tween.to({ x: pos.x, y: pos.y }, 200).wait(50);
    }
    tween.call(function () {
        createjs.Ticker.paused = true;
    });
    createjs.Ticker.paused = false;
};

Card.prototype.update = function () {
    var pos = this.getPosition(this.square);
    this.container.x = pos.x;
    this.container.y = pos.y;
};

Card.prototype.getPosition = function (square) {
    var pos = {};
    pos.x = square.container.x - this.squareImage.width / 2;
    pos.y = square.container.y - this.squareImage.height + square.getHeight() / 5;
    return pos;
};