function GeographicCoordinate(_ellipsoid, _latitude, _longitude, _height) {
    this.ellipsoid          = _ellipsoid;
    this.latitude           = _latitude;
    this.longitude          = _longitude;
    this.height             = (_height == undefined) ? 0.0 : _height;
    this.transverseMercator = undefined;
};

GeographicCoordinate.prototype.getEllipsoid = function() {
    return this.ellipsoid;
};

GeographicCoordinate.prototype.getLatitude = function() {
    return this.latitude;
};

GeographicCoordinate.prototype.getLongitude = function() {
    return this.longitude;
};

GeographicCoordinate.prototype.getEllipsoidalHeight = function() {
    return this.height;
};

GeographicCoordinate.prototype.toUTM = function(zone) {
    if(!zone) {
        return this._toUTM();
    } else {
        return this._toUTMWithZone(zone);
    }
};

GeographicCoordinate.prototype._toUTM = function() {
    return this.getTransverseMercator().convertoToUTM(this, this.getLongitude().getCentralMeridian().toDegreeDecimal());
};

GeographicCoordinate.prototype._toUTMWithZone = function(zone) {
    return this.getTransverseMercator().convertoToUTM(this, Longitude.calcCentralMeridian(zone));
};

GeographicCoordinate.prototype.getMeridianConvergence = function() {
    return this.getTransverseMercator().convergenceFromGeographic(this);
};

GeographicCoordinate.prototype.getScaleCorrection = function() {
    return this.getTransverseMercator().scaleCorrection(this);
};

GeographicCoordinate.prototype.getTransverseMercator = function() {
    if (this.ellipsoid == undefined) {
        throw("Não é possível realizar a conversão porque esta coordenada não possui um datum definido.");
    }
    if (this.transverseMercator == undefined) {
        this.transverseMercator = new TransverseMercator(longitude.getCentralMeridian(), this.ellipsoid);
    }
    return this.transverseMercator;
};

GeographicCoordinate.prototype.toString = function() {
    return this.getLatitude() + ' , ' + this.getLongitude();
};

GeographicCoordinate.prototype.equals = function(otherCoordinate) {
    if(otherCoordinate instanceof GeographicCoordinate) {
        return (this.getLatitude().equals(otherCoordinate.getLatitude()) && 
                this.getLongitude().equals(otherCoordinate.getLongitude()));
    }
    return false;
};