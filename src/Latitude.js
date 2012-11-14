var Hemisphere = {
    NORTH: 0,
    SOUTH: 1
};

function Latitude(dValue) {
	this.delegate = new AngleValue(dValue);
    if (this.delegate.toDegreeDecimal() < -80.0 || this.delegate.toDegreeDecimal() > 84.0) {
        throw ("Valor de latitude incorreto: " + this.delegate.toString());
    }
};

Latitude.prototype.getHemisphere = function() {
    return this.delegate.isPositive() ? Hemisphere.NORTH : Hemisphere.SOUTH;
};

Latitude.prototype.toString = function() {
    var value = this.delegate.toString("dd" + UNICODE_DEGREE + "mm\'ss\" NS");
    value = value.replace("NS", this.delegate.isPositive() ? "N" : "S");

    return value;
};

Latitude.prototype.toString = function(pattern, precision) {
    var value = this.delegate.toString(pattern, precision);
    value = value.replace("NS", this.delegate.isPositive() ? "N" : "S");

    return value;
};

Latitude.prototype.toDegreeDecimal = function() {
    return this.delegate.toDegreeDecimal();
};

Latitude.prototype.toRadians = function() {
    return this.delegate.toRadians();
};

Latitude.prototype.equals = function(otherObj) {
    if(otherObj instanceof Latitude) {
        return Math.compareFloat(this.toDegreeDecimal(), otherObj.toDegreeDecimal());
    }
    return false;
};