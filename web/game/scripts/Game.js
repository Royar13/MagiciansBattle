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