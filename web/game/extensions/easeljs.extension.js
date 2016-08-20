createjs.Bitmap.prototype.setWidth = function (width) {
    this.scaleX = width / this.image.width;
    this.scaleY = this.scaleX;
    this.width = width;
    this.height = this.image.height * this.scaleY;
};