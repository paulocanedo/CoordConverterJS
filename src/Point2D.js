function Point2D(_x, _y) {
	this.x = _x;
	this.y = _y;
};

Point2D.prototype.getX = function() {
	return this.x;
};

Point2D.prototype.getY = function() {
	return this.y;
};

Point2D.prototype.setX = function(_x) {
	this.x = _x;
};

Point2D.prototype.setY = function(_y) {
	this.y = _y;
};

Point2D.prototype.location = function(_x, _y) {
	this.setX(_x);
	this.setY(_y);
};

Point2D.prototype.toString = function() {
	return '' + this.x.toFixed(3) + ", " + this.y.toFixed(3);
};