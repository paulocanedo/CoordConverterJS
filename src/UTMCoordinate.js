function UTMCoordinate(_ellipsoid, _zone, _hemisphere, _east, _north, _height) {
    this.point2d            = new Point2D(0.0, 0.0);
    this.zone               = 0;
    this.height             = 0.0;
    this.ellipsoid          = undefined;
    this.hemisphere         = undefined;
    this.transverseMercator = undefined;

    this.ellipsoid  = _ellipsoid;
    this.zone       = _zone;
    this.hemisphere = _hemisphere;
    this.height     = _height == undefined ? 0.0 : _height;
    this.point2d.location(_east, _north);    
};

UTMCoordinate.prototype.toGeodesic = function() {
    return this.getTransverseMercator().convertToGeographic(this);
};

UTMCoordinate.prototype.getTransverseMercator = function() {
    if (this.ellipsoid == undefined) {
        throw ("Não é possível realizar a conversão porque esta coordenada não possui um datum definido.");
    }
    if (this.transverseMercator == undefined) {
        var centralMeridian = new Longitude(Longitude.calcCentralMeridian(this.zone));
        this.transverseMercator = new TransverseMercator(centralMeridian, this.ellipsoid);
    }
    return this.transverseMercator;
};

UTMCoordinate.prototype.getZone = function() {
    return this.zone;
};

UTMCoordinate.prototype.getHemisphere = function() {
    return this.hemisphere;
};

UTMCoordinate.prototype.getEast = function() {
    return this.point2d.getX();
};

UTMCoordinate.prototype.getNorth = function() {
    return this.point2d.getY();
};

UTMCoordinate.prototype.setEllipsoidalHeight = function(_height) {
    this.height = _height;
};

UTMCoordinate.prototype.getEllipsoidalHeight = function() {
    return this.height;
};

UTMCoordinate.prototype.getEllipsoid = function() {
    return this.ellipsoid;
};

UTMCoordinate.prototype.toString = function() {
    return "E: " + this.point2d.getX().toFixed(3) + ", N: " + this.point2d.getY().toFixed(3);
};

UTMCoordinate.prototype.equals = function(otherCoordinate) {
    if(otherCoordinate instanceof UTMCoordinate) {
        return (this.zone = otherCoordinate.zone) &&
               Math.compareFloat(this.getEllipsoidalHeight(), otherCoordinate.getEllipsoidalHeight()) &&
               Math.compareFloat(this.getEast(), otherCoordinate.getEast()) && 
               Math.compareFloat(this.getNorth(), otherCoordinate.getNorth());
    }
    return false;
};