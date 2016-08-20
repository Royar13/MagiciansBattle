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