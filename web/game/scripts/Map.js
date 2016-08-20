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