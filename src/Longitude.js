Longitude.calcCentralMeridian = function(zone) {
    return 6 * zone - 183;
};

Longitude.getCentralMeridian = function(zone) {
    return new Longitude(Longitude.calcCentralMeridian(zone));
};

function Longitude(longitude) {
    if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("Valor de longitude incorreto: " + longitude);
    }
    this.delegate = new AngleValue(longitude);

};

Longitude.prototype.getCentralMeridian = function() {
    return Longitude.getCentralMeridian(this.getZone());
};

Longitude.prototype.getZone = function() {
    var longitude = this.delegate.toDegreeDecimal();
    if (longitude < 0.0) {
        return (Math.truncate((180 + longitude) / 6.0)) + 1;
    } else {
        return (Math.truncate(longitude / 6)) + 31;
    }
};

Longitude.prototype.toString = function() {
    var value = this.delegate.toString("dd" + AngleValue.UNICODE_DEGREE + "mm\'ss\" EW");
    value = value.replace("EW", this.delegate.isPositive() ? "E" : "W");

    return value;
};

Longitude.prototype.toString = function(pattern, precision) {
    var value = this.delegate.toString(pattern, precision);
    value = value.replace("EW", this.delegate.isPositive() ? "E" : "W");

    return value;
};

Longitude.prototype.toMeridianCentralString = function() {
    return this.toString("dd" + AngleValue.UNICODE_DEGREE + "EWgr", 0);
};

Longitude.prototype.toDegreeDecimal = function() {
    return this.delegate.toDegreeDecimal();
};

Longitude.prototype.toRadians = function() {
    return this.delegate.toRadians();
};

Longitude.prototype.equals = function(otherObj) {
    if(otherObj instanceof Longitude) {
        return Math.compareFloat(this.toDegreeDecimal(), otherObj.toDegreeDecimal());
    }
    return false;
};