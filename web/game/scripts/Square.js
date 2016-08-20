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
