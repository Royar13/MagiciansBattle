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
function Game() {
    this.loader = new Loader(this.newGame);
}

Game.prototype.newGame = function () {
    this.resolution = { x: $(window).width(), y: $(window).height() };
    $("#map").attr({ width: this.resolution.x, height: this.resolution.y });
    stage = new createjs.Stage("map");
    createjs.Ticker.addEventListener("tick", function (e) {
        if (!e.paused) {
            stage.update();
        }
    });
    createjs.Ticker.paused = true;
    this.map = new Map();
};

Game.prototype.updateStage = function () {
    if (createjs.Ticker.paused)
        stage.update();
};
function Loader(callback) {
    var manifest = [
           { src: "magician.png", id: "magician" }
    ];
    this.resources = new createjs.LoadQueue();
    this.resources.addEventListener("complete", callback);
    this.resources.loadManifest(manifest, true, "images/");
}

Loader.prototype.getItem = function (id) {
    return this.resources.getResult(id);
}
var stage;
var game;
$(document).ready(function () {
    game = new Game();
});

function Map() {
    this.size = { x: 15, y: 10 };
    this.zoom = 1;
    this.minZoom = 0.5;
    this.maxZoom = 2;
    this.hexRadius = 80;
    this.squares = new Array();
    this.dragStart = null;
    this.selectedSquare = null;
    this.cancelSquareClick = false;
    for (var y = 0; y < this.size.y; y++) {
        this.squares[y] = new Array();
        for (var x = 0; x < this.size.x; x++) {
            this.squares[y][x] = new Square(this, x, y);
        }
    }
    var card = new Card();
    card.create(this.squares[0][0]);

    var card = new Card();
    card.create(this.squares[5][5]);
    game.updateStage();

    $("#map").on("mousewheel", function (e) {
        this.changeZoom(e.deltaY, { x: e.clientX, y: e.clientY });
        game.updateStage();
    }.bind(this));
    stage.addEventListener("stagemousedown", function (e) {
        this.cancelSquareClick = false;

        this.dragStart = { x: e.stageX - stage.x, y: e.stageY - stage.y };
        this.mapDragHandlerProxy = this.mapDragHandler.bind(this);
        stage.addEventListener("stagemousemove", this.mapDragHandlerProxy);
        this.mapDragEndHandlerProxy = this.mapDragEndHandler.bind(this);
        stage.addEventListener("stagemouseup", this.mapDragEndHandlerProxy);
    }.bind(this));
    stage.addEventListener("stagemouseup", function (e) {
    }.bind(this));
}

Map.prototype.mapDragHandler = function (e) {
    this.cancelSquareClick = true;

    stage.x = e.stageX - this.dragStart.x;
    stage.y = e.stageY - this.dragStart.y;
    game.updateStage();
};

Map.prototype.mapDragEndHandler = function (e) {
    this.dragStart = null;
    stage.removeEventListener("stagemousemove", this.mapDragHandlerProxy);
    stage.removeEventListener("stagemouseup", this.mapDragEndHandlerProxy);
};

Map.prototype.changeZoom = function (delta, zoomPosition) {
    var newZoom = Math.max(Math.min(this.zoom + delta * 0.1, this.maxZoom), this.minZoom);
    var changeFraction = newZoom / this.zoom;
    this.zoom = newZoom;
    stage.x -= (zoomPosition.x - stage.x) * (changeFraction - 1);
    stage.y -= (zoomPosition.y - stage.y) * (changeFraction - 1);
    stage.scaleX = this.zoom;
    stage.scaleY = this.zoom;
};

Map.prototype.validatePoint = function (point) {
    return (point.x >= 0 && point.x < this.size.x && point.y >= 0 && point.y < this.size.y) ? point : null;
};

Map.prototype.hideLegalMoves = function () {
    for (var i in this.selectedSquare.card.legalMoves) {
        this.selectedSquare.card.legalMoves[i].hideLegalMove();
    }
    this.selectedSquare.card.legalMoves = null;
};

//static
Map.comparePoints = function (a, b) {
    return (a.x == b.x && a.y == b.y);
};
function Square(map, x, y) {
    this.map = map;
    this.index = { x: x, y: y };
    this.container = new createjs.Container();
    var pos = this.getPosition();
    this.container.x = pos.x;
    this.container.y = pos.y;

    this.hex = new createjs.Shape();
    this.drawHex("#fff");
    this.container.addChild(this.hex);
    stage.addChild(this.container);

    this.container.addEventListener("click", this.select.bind(this));

    this.access = new Array();
    this.access["upleft"] = { x: this.index.x - 1, y: this.index.y - 1 };
    this.access["upright"] = { x: this.index.x, y: this.index.y - 1 };
    this.access["bottomleft"] = { x: this.index.x - 1, y: this.index.y + 1 };
    this.access["bottomright"] = { x: this.index.x, y: this.index.y + 1 };
    if (this.index.y % 2 != 0) {
        for (var i in this.access) {
            this.access[i].x += 1;
        }
    }
    this.access["left"] = { x: this.index.x - 1, y: this.index.y };
    this.access["right"] = { x: this.index.x + 1, y: this.index.y };
    for (var i in this.access) {
        this.access[i] = this.map.validatePoint(this.access[i]);
    }

}
Square.prototype.drawHex = function (fill) {
    this.hex.graphics.clear().beginStroke("#000").beginFill(fill).drawPolyStar(0, 0, this.map.hexRadius, 6, 0, 30);
};

Square.prototype.select = function () {
    if (this.card == null || this.map.cancelSquareClick) return;
    if (this.map.selectedSquare != null) {
        if (this.map.selectedSquare === this) {
            this.unselect();
            return;
        }

        this.map.selectedSquare.unselect();
    }
    this.map.selectedSquare = this;
    this.card.showLegalMoves();
};

Square.prototype.unselect = function () {

};

Square.prototype.showLegalMove = function () {
    this.drawHex("#0e76d6");
    this.legalMoveClickHandlerProxy = this.legalMoveClickHandler.bind(this);
    this.container.addEventListener("click", this.legalMoveClickHandlerProxy);
};

Square.prototype.hideLegalMove = function () {
    this.container.removeEventListener("click", this.legalMoveClickHandlerProxy);
    //this.container.removeAllEventListeners();
    this.drawHex("#fff");
};

Square.prototype.legalMoveClickHandler = function () {
    this.map.hideLegalMoves();
    var selectedCard = this.map.selectedSquare.card;
    selectedCard.moveToSquare(this);
};

Square.prototype.getPosition = function () {
    var pos = {};
    var width = this.getWidth();
    pos.x = (this.index.x + 0.5) * width;
    if (this.index.y % 2 != 0) {
        pos.x += width / 2;
    }
    var rowHeight = 1.5 * this.map.hexRadius;
    pos.y = this.index.y * rowHeight + this.map.hexRadius;
    return pos;
};

Square.prototype.getWidth = function () {
    return Math.cos(Math.PI / 6) * this.map.hexRadius * 2;
};

Square.prototype.getHeight = function () {
    return this.map.hexRadius * 2;
};

Square.prototype.setCard = function (card) {
    this.card = card;
};

Square.prototype.unsetCard = function () {
    this.card = null;
};

//# sourceMappingURL=maps/script.js.map
