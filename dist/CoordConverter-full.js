AngleValue.UNICODE_DEGREE = "\u00b0";

AngleValue.dms2dd = function(degree, minute, second, positive) {
    if (positive) {
        return degree + (minute / 60.0) + (second / 3600.0);
    } else {
        return -degree - (minute / 60.0) - (second / 3600.0);
    }
};

AngleValue.dd2dms = function(decimalDegree) {
    var positive = true;
    var toReturn = new Array();
    if (decimalDegree < 0) {
        decimalDegree = -decimalDegree;
        positive = false;
    }

    var degree, minute, decimalMinute;
    degree = Math.truncate(decimalDegree);
    decimalMinute = (decimalDegree - degree) * 60;
    minute = Math.truncate(decimalMinute);

    var decimalSecond = (decimalMinute - minute) * 60;

    if (decimalSecond == 60) {
        decimalSecond = 0;
        minute++;
    }

    if (minute == 60) {
        minute = 0;
        degree++;
    }

    toReturn[0] = degree;
    toReturn[1] = minute;
    toReturn[2] = decimalSecond;
    toReturn[3] = positive;
    return toReturn;
};

function AngleValue(dValue) {
	this.decimalValue = dValue;
	this.fragmentedValue = AngleValue.dd2dms(dValue);
};

AngleValue.prototype.isPositive = function() {
    return this.decimalValue > 0;
};

AngleValue.prototype.getDegree = function() {
    return this.fragmentedValue[0];
};

AngleValue.prototype.getMinute = function() {
    return this.fragmentedValue[1];
};

AngleValue.prototype.getSecond = function() {
    return this.fragmentedValue[2];
};

AngleValue.prototype.toDegreeDecimal = function() {
    return this.decimalValue;
};

AngleValue.prototype.toRadians = function() {
    return Math.toRadians(this.toDegreeDecimal());
};

AngleValue.prototype.toString = function() {
    return this.toStringWithPattern("+-dd" + AngleValue.UNICODE_DEGREE + "mm\'ss\"");
};


AngleValue.prototype.toStringWithPattern = function(_pattern, _precision) {
    var value = _pattern;
    var precision = 5;
    if(_precision) {
        precision = _precision;
    }

    value = value.replace("+", this.isPositive() ? "+" : "");
    value = value.replace("-", this.isPositive() ? "" : "-");
    value = value.replace("dd", Math.pad(this.getDegree(), 2));
    value = value.replace("mm", Math.pad(this.getMinute(), 2));

    var second = this.getSecond().toFixed(precision);
    if (this.getSecond() < 10) {
        second = "0" + second;
    }
    value = value.replace("ss", second);

    return value;
};function Datum(_name, _a, _b, _inverseFlattening) {
    this.name              = _name;
    this.A0                = 0;
    this.B0                = 0;
    this.C0                = 0;
    this.D0                = 0;
    this.E0                = 0;
    this.a                 = _a;
    this.b                 = _b;
    this.flattening        = undefined;
    this.inverseFlattening = _inverseFlattening;
    this.n                 = 0;
    this.rm                = 0;
    this.e                 = 0;
    this.e1sq              = 0;

    this.calculateAllValues();
};

Datum.prototype.calculateAllValues = function() {
    if (this.flattening == undefined) {
        this.flattening = this.calculateFlattening();
    }

    if (this.inverseFlattening == undefined) {
        this.inverseFlattening = this.calculateInverseFlattening();
    }

    if (this.n == 0) {
        this.n = this.calculate_n();
    }

    if (this.rm == 0) {
        this.rm = this.calculateMeanRadius();
    }

    if (this.e == 0) {
        this.e = this.calculateEccentricity();
    }

    if (this.e1sq == 0) {
        this.e1sq = this.calculateEccentricitySq();
    }

    this.A0 = this.calculateA0();
    this.B0 = this.calculateB0();
    this.C0 = this.calculateC0();
    this.D0 = this.calculateD0();
    this.E0 = this.calculateE0();
};

Datum.prototype.calculate_n = function() {
    return (this.a - this.b) / (this.a + this.b);
};

Datum.prototype.calculateFlattening = function() {
    return (this.a - this.b) / this.a;
};

Datum.prototype.calculateInverseFlattening = function() {
    return 1 / this.flattening;
};

Datum.prototype.calculateMeanRadius = function() {
    return Math.pow(this.a * this.b, 1 / 2.0);
};

Datum.prototype.calculateEccentricity = function() {
    return Math.sqrt(1 - Math.pow(this.b / this.a, 2));
};

Datum.prototype.calculateEccentricitySq = function() {
    return this.e * this.e / (1 - this.e * this.e);
};

Datum.prototype.calculateA0 = function() {
    return this.a * 
            (1 - this.n + 5 / 4.0 * (Math.pow(this.n, 2) - Math.pow(this.n, 3)) + 81 / 64.0 * 
                (Math.pow(this.n, 4) - Math.pow(this.n, 5)));
};

Datum.prototype.calculateB0 = function() {
    return 3 / 2.0 * this.a * 
            (this.n - Math.pow(this.n, 2) + (7 / 8.0) * (Math.pow(this.n, 3) - 
                Math.pow(this.n, 4) + (55 / 64.0) * Math.pow(this.n, 5)));
};

Datum.prototype.calculateC0 = function() {
    return 15 / 16.0 * this.a * (Math.pow(this.n, 2) - Math.pow(this.n, 3) + 
            (3 / 4.0) * (Math.pow(this.n, 4) - Math.pow(this.n, 5)));
};

Datum.prototype.calculateD0 = function() {
    return 35 / 48.0 * this.a * (Math.pow(this.n, 3) - Math.pow(this.n, 4) + (11 / 16.0) * Math.pow(this.n, 5));
};

Datum.prototype.calculateE0 = function() {
    return 315 / 512.0 * this.a * (Math.pow(this.n, 4) - Math.pow(this.n, 5));
};

Datum.prototype.getSemiMajorAxis = function() {
    return this.a;
};

Datum.prototype.getSemiMinorAxis = function() {
    return this.b;
};

Datum.prototype.getFlattening = function() {
    return this.flattening;
};

Datum.prototype.getInverseFlattening = function() {
    return this.inverseFlattening;
};

Datum.prototype.getMeanRadius = function() {
    return this.rm;
};

Datum.prototype.getEccentricity = function() {
    return this.e;
};

Datum.prototype.getEccentricitySq = function() {
    return this.e1sq;
};

Datum.prototype.getA0 = function() {
    return this.A0;
};

Datum.prototype.getB0 = function() {
    return this.B0;
};

Datum.prototype.getC0 = function() {
    return this.C0;
};

Datum.prototype.getD0 = function() {
    return this.D0;
};

Datum.prototype.getE0 = function() {
    return this.E0;
};

var DatumFactory = {
    WGS84 : new Datum('WGS 1984',    6378137, 6356752.314245, 298.257223563),
    SIRGAS: new Datum('SIRGAS 2000', 6378137, 6356752.314130, 298.257222101),
    GRS80 : new Datum('GRS 1980',    6378137, 6356752.314130, 298.257222101),
    create: function(name, a, b, inverseFlattening) {
        return new Datum(name, a , b, inverseFlattening);
    }
};Ellipsoid.calcS = function(A, B, C, D, E, _latRad) {
    return A * _latRad - B * Math.sin(2 * _latRad) + C * Math.sin(4 * _latRad) - 
            D * Math.sin(6 * _latRad) + E * Math.sin(8 * _latRad);
};

function Ellipsoid(_datum) {
    this.datum = datum = _datum;
    this.a     = a = datum.getSemiMajorAxis();
    this.b     = b = datum.getSemiMinorAxis();
    this.e2    = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(a, 2);
    this.el2   = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(b, 2);
    this.n     = n = (a - b) / (a + b);
    this.A     = a * (1 - n + 5 / 4.0 * (Math.pow(n, 2) - Math.pow(n, 3)) + 81 / 64.0 * (Math.pow(n, 4) - 
                 Math.pow(n, 5)));
    this.B     = 3 / 2.0 * a * (n - Math.pow(n, 2) + (7 / 8.0) * (Math.pow(n, 3) - Math.pow(n, 4) + 
                 (55 / 64.0) * Math.pow(n, 5)));
    this.C     = 15 / 16.0 * a * (Math.pow(n, 2) - Math.pow(n, 3) + (3 / 4.0) * (Math.pow(n, 4) - Math.pow(n, 5)));
    this.D     = 35 / 48.0 * a * (Math.pow(n, 3) - Math.pow(n, 4) + (11 / 16.0) * Math.pow(n, 5));
    this.E     = 315 / 512.0 * a * (Math.pow(n, 4) - Math.pow(n, 5));      
};

Ellipsoid.prototype.getE2 = function() {
    return this.e2;
};

Ellipsoid.prototype.getN = function() {
    return this.n;
};

Ellipsoid.prototype.getEl2 = function() {
    return this.el2;
};

Ellipsoid.prototype.calcRHO = function(_latRad) {
    return this.a * (1 - this.e2) / 
            Math.pow(1 - this.e2 * Math.pow(Math.sin(_latRad), 2), 3 / 2.0);
};

Ellipsoid.prototype.calcNU = function(_latRad) {
    return this.a / Math.sqrt(1.e0 - this.e2 * Math.pow(Math.sin(_latRad), 2.0));
};

Ellipsoid.prototype.calcS = function(_latRad) {
    return Ellipsoid.calcS(this.A, this.B, this.C, this.D, this.E, _latRad);
};

Ellipsoid.prototype.getDatum = function() {
    return this.datum;
};
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
};Math.truncate = function(_value) {
  if (_value<0) return Math.ceil(_value);
  else return Math.floor(_value);
};

Math.toRadians = function(_value) {
	return _value * (Math.PI / 180);
};

Math.toDegrees = function(_value) {
	return _value * (180 / Math.PI);
};

Math.pad = function(_value, length) {  
    var str = '' + _value;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
};

Math.compareFloat = function(number1, number2, _precision) {
	var precision = 3;
	if(_precision) {
		precision = _precision;
	}
	return (number1.toFixed(precision)) == (number2.toFixed(precision));
};var Hemisphere = {
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
        return Math.compareFloat(this.toDegreeDecimal(), otherObj.toDegreeDecimal(), 6);
    }
    return false;
};Longitude.calcCentralMeridian = function(zone) {
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
        return Math.compareFloat(this.toDegreeDecimal(), otherObj.toDegreeDecimal(), 6);
    }
    return false;
};function Point2D(_x, _y) {
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
};Math_SIN1 = Math.sin(new AngleValue(AngleValue.dms2dd(0, 0, 1, true)).toRadians());

function TransverseMercator(_centralMeridian, _ellipsoid) {
    this.deltaEasting        = 40000000.0;
    this.deltaNorthing       = 40000000.0;
    this.falseEasting        = 500000.0;
    this.falseNorthing       = 10000000.0;
    this.scaleFactor0        = 0.9996;
    this.centralMeridian     = _centralMeridian;
    this.latitudeOfTrueScale = new Latitude(0.0);
    this.ellipsoid           = _ellipsoid;
};

TransverseMercator.prototype.convertoToUTM = function(_coordinate, _centralMeridian) {
    var sin1                = Math_SIN1;
    var scaleFactor0        = this.scaleFactor0;
    var centralMeridian     = this.centralMeridian;
    var latitudeOfTrueScale = this.latitudeOfTrueScale;
    var ellipsoid           = this.ellipsoid;
    var falseEasting        = this.falseEasting;
    var falseNorthing       = this.falseNorthing;

    lon = _coordinate.getLongitude().toDegreeDecimal();
    latRad = _coordinate.getLatitude().toRadians();

    el2 = ellipsoid.getEl2();
    eta = el2 * Math.pow(Math.cos(latRad), 2);
    el4 = eta * eta;
    el6 = el4 * eta;
    el8 = el6 * eta;

    S = ellipsoid.calcS(latRad);
    nu = ellipsoid.calcNU(latRad);

    T1 = S * scaleFactor0;
    T2 = nu * Math.sin(latRad) * Math.cos(latRad) * scaleFactor0 / 2.0;
    T3 = nu * Math.sin(latRad) * Math.pow(Math.cos(latRad), 3) * scaleFactor0 / 24.0
            * (5 - Math.pow(Math.tan(latRad), 2) + 9 * el2 * Math.pow(Math.cos(latRad), 2) + 4 * el4 * Math.pow(Math.cos(latRad), 4));

    T4 = ((nu * Math.sin(latRad) * Math.pow(Math.cos(latRad), 5) * scaleFactor0) / 720.0)
            * (61 - 58 * Math.pow(Math.tan(latRad), 2) + Math.pow(Math.tan(latRad), 4) + 270 * el2 * Math.pow(Math.cos(latRad), 2) - 330 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2)
            + 445 * el4 * Math.pow(Math.cos(latRad), 4) + 324 * el6 * Math.pow(Math.cos(latRad), 6) - 680 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4)
            + 88 * el8 * Math.pow(Math.cos(latRad), 8) - 600 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6) - 192 * Math.pow(Math.tan(latRad), 2) * el8 * Math.pow(Math.cos(latRad), 8));
    T6 = nu * Math.cos(latRad) * scaleFactor0;
    T7 = nu * Math.pow(Math.cos(latRad), 3) * scaleFactor0 / 6.0
            * (1 - Math.pow(Math.tan(latRad), 2) + el2 * Math.pow(Math.cos(latRad), 2));
    T8 = nu * Math.pow(Math.cos(latRad), 5) * scaleFactor0 / 120.0
            * (5 - 18 * Math.pow(Math.tan(latRad), 2) + Math.pow(Math.tan(latRad), 4) + 14 * el2 * Math.pow(Math.cos(latRad), 2) - 58 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2) + 13 * el4 * Math.pow(Math.cos(latRad), 4)
            + 4 * el6 * Math.pow(Math.cos(latRad), 6) - 64 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4) - 24 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6));

    deltaLon = lon - _centralMeridian;

    deltaLonSeconds = deltaLon * 60 * 60;
    p = 0.0001 * Math.abs(deltaLonSeconds);

    f1 = T1;
    f2 = T2 * Math.pow(sin1, 2) * 1E8;
    f3 = T3 * Math.pow(sin1, 4) * 1E16;
    f4 = T6 * sin1 * 1E4;
    f5 = T7 * Math.pow(sin1, 3) * 1E12;

    A6 = (T4 * Math.pow(sin1, 6)) * 1E24;
    B5 = (T8 * Math.pow(sin1, 5)) * 1E20;

    utm_north = f1 + f2 * Math.pow(p, 2) + f3 * Math.pow(p, 4) + A6 * Math.pow(p, 6);
    if (latRad < 0) {
        utm_north = falseNorthing + utm_north;
    }

    deltaEast = (f4 * p + f5 * Math.pow(p, 3) + B5 * Math.pow(p, 5));
    utm_east = deltaLon > 0 ? (falseEasting + deltaEast) : (falseEasting - deltaEast);

    zone = _coordinate.getLongitude().getZone();
    hemisphere = _coordinate.getLatitude().getHemisphere();

    return new UTMCoordinate(ellipsoid, zone, hemisphere, utm_east, utm_north, _coordinate.getEllipsoidalHeight());
};

TransverseMercator.prototype.convertToGeographic = function(_coordinate) {
    var sin1                = Math_SIN1;
    var scaleFactor0        = this.scaleFactor0;
    var centralMeridian     = this.centralMeridian;
    var latitudeOfTrueScale = this.latitudeOfTrueScale;
    var ellipsoid           = this.ellipsoid;
    var falseEasting        = this.falseEasting;
    var falseNorthing       = this.falseNorthing;

    northing = _coordinate.getNorth(), easting = _coordinate.getEast();
    if (_coordinate.getHemisphere() == Hemisphere.SOUTH) {
        northing = northing - falseNorthing;
    }

    lon0 = centralMeridian.toDegreeDecimal();
    phi1 = latitudeOfTrueScale.toRadians();

    tmdo = ellipsoid.calcS(phi1);
    tmd = tmdo + northing / scaleFactor0;
    phi1 = tmd / ellipsoid.calcRHO(phi1);
    t10 = 0, sr = 0;
    for (i = 0; i < 5; i++) {
        t10 = ellipsoid.calcS(phi1);
        sr = ellipsoid.calcRHO(phi1);
        phi1 = phi1 + (tmd - t10) / sr;
    }
    
    el2 = ellipsoid.getEl2();
    eta = el2 * Math.pow(Math.cos(phi1), 2.0);
    el4 = eta * eta;
    el6 = el4 * eta;
    el8 = el6 * eta;

    rho = ellipsoid.calcRHO(phi1);
    nu = ellipsoid.calcNU(phi1);

    T10 = Math.tan(phi1) / (2 * rho * nu * Math.pow(scaleFactor0, 2));
    T11 = Math.tan(phi1) / (24.0 * rho * Math.pow(nu, 3) * Math.pow(scaleFactor0, 4))
            * (5 + 3 * Math.pow(Math.tan(phi1), 2) + el2 * Math.pow(Math.cos(phi1), 2) - 4 * el4 * Math.pow(Math.cos(phi1), 4) - 9 * Math.pow(Math.tan(phi1), 2) * el2 * Math.pow(Math.cos(phi1), 2));
    T12 = Math.tan(phi1) / (720.0 * rho * Math.pow(nu, 5) * Math.pow(scaleFactor0, 6))
            * (61 + 90 * Math.pow(Math.tan(phi1), 2) + 46 * el2 * Math.pow(Math.cos(phi1), 2) + 45 * Math.pow(Math.tan(phi1), 4) - 252 * Math.pow(Math.tan(phi1), 2) * el2 * Math.pow(Math.cos(phi1), 2)
            - 3 * el4 * Math.pow(Math.cos(phi1), 4) + 100 * el6 * Math.pow(Math.cos(phi1), 6) - 66 * Math.pow(Math.tan(phi1), 2) * el4 * Math.pow(Math.cos(phi1), 4)
            - 90 * Math.pow(Math.tan(phi1), 4) * el2 * Math.pow(Math.cos(phi1), 2) + 88 * el8 * Math.pow(Math.cos(phi1), 8) + 225 * Math.pow(Math.tan(phi1), 4) * el4 * Math.pow(Math.cos(phi1), 4)
            + 84 * Math.pow(Math.tan(phi1), 2) * el6 * Math.pow(Math.cos(phi1), 6) - 192 * Math.pow(Math.tan(phi1), 2) * el8 * Math.pow(Math.cos(phi1), 8));
    T13 = Math.tan(phi1) / (40320.0 * rho * Math.pow(nu, 7) * Math.pow(scaleFactor0, 8))
            * (1385 + 3633 * Math.pow(Math.tan(phi1), 2) + 4095 * Math.pow(Math.tan(phi1), 4) + 1575 * Math.pow(Math.tan(phi1), 6));
    T14 = 1.0 / (nu * Math.cos(phi1) * scaleFactor0);
    T15 = (1.0 / (6 * Math.pow(nu, 3) * Math.cos(phi1) * Math.pow(scaleFactor0, 3)))
            * (1 + 2 * Math.pow(Math.tan(phi1), 2) + el2 * Math.pow(Math.cos(phi1), 2));
    T16 = 1.0 / (120 * Math.pow(nu, 5) * Math.cos(phi1) * Math.pow(scaleFactor0, 5))
            * (5 + 6 * el2 * Math.pow(Math.cos(phi1), 2) + 28 * Math.pow(Math.tan(phi1), 2) - 3 * el4 * Math.pow(Math.cos(phi1), 4) + 8 * Math.pow(Math.tan(phi1), 2) * el2 * Math.pow(Math.cos(phi1), 2)
            + 24 * Math.pow(Math.tan(phi1), 4) - 4 * el6 * Math.pow(Math.cos(phi1), 6) + 4 * Math.pow(Math.tan(phi1), 2) * el4 * Math.pow(Math.cos(phi1), 4) + 24 * Math.pow(Math.tan(phi1), 2) * el6 * Math.pow(Math.cos(phi1), 6));

    de = easting - falseEasting;

    if (Math.abs(de) < 0.0001) {
        de = 0.0;
    }
    q = 0.000001 * de;
    f9 = (T14 / sin1) * 1E6;
    f10 = (T15 / sin1) * 1E18;
    E5 = (T16 / sin1) * 1E30;

    lat = phi1 - Math.pow(de, 2.0) * T10 + Math.pow(de, 4.0) * T11 - Math.pow(de, 6.0) * T12
            + Math.pow(de, 8.0) * T13;
    dlon = f9 * q - f10 * Math.pow(q, 3) + E5 * Math.pow(q, 5);
    lon = lon0 + dlon / 3600;

    return new GeographicCoordinate(ellipsoid, new Latitude(Math.toDegrees(lat)), new Longitude(lon), _coordinate.getEllipsoidalHeight());
};

TransverseMercator.prototype.convergenceFromGeographic = function(_coordinate) {
    var sin1                = Math_SIN1;
    var scaleFactor0        = this.scaleFactor0;
    var centralMeridian     = this.centralMeridian;
    var latitudeOfTrueScale = this.latitudeOfTrueScale;
    var ellipsoid           = this.ellipsoid;

    latRad = _coordinate.getLatitude().toRadians();
    lon = _coordinate.getLongitude().toDegreeDecimal();
    lon0 = _coordinate.getLongitude().getCentralMeridian().toDegreeDecimal();

    deltaLon = lon - lon0;
    deltaLonSeconds = deltaLon * 60 * 60;
    p = 0.0001 * Math.abs(deltaLonSeconds);

    el2 = ellipsoid.getEl2();
    eta = el2 * Math.pow(Math.cos(latRad), 2.0);
    el4 = eta * eta;
    el6 = el4 * eta;
    el8 = el6 * eta;

    T18 = Math.sin(latRad);
    T19 = Math.sin(latRad) * Math.pow(Math.cos(latRad), 2) / 3.0
            * (1 + 3 * el2 * Math.pow(Math.cos(latRad), 2) + 2 * el4 * Math.pow(Math.cos(latRad), 4));
    T20 = Math.sin(latRad) * Math.pow(Math.cos(latRad), 4) / 15.0
            * (2 - Math.pow(Math.tan(latRad), 2) + 15 * el2 * Math.pow(Math.cos(latRad), 2) + 35 * el4 * Math.pow(Math.cos(latRad), 4) - 15 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2) + 33 * el6 * Math.pow(Math.cos(latRad), 6)
            - 50 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4) + 11 * el8 * Math.pow(Math.cos(latRad), 8) - 60 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6)
            - 24 * Math.pow(Math.tan(latRad), 2) * el8 * Math.pow(Math.cos(latRad), 8));

    C5 = (T20 * Math.pow(sin1, 4)) * 1E20;

    f12 = T18 * 1E4;
    f13 = (T19 * Math.pow(sin1, 2)) * 1E12;

    convergence = f12 * p + f13 * Math.pow(p, 3) + C5 * Math.pow(p, 5);
    convergence = Math.abs(convergence);
    
    if ((deltaLon < 0 && latRad > 0) || (deltaLon > 0 && latRad < 0)) {
        convergence *= -1;
    }

    return new AngleValue(convergence / 3600);
};

TransverseMercator.prototype.scaleCorrection = function(_coordinate) {
    var sin1                = Math_SIN1;
    var scaleFactor0        = this.scaleFactor0;
    var centralMeridian     = this.centralMeridian;
    var latitudeOfTrueScale = this.latitudeOfTrueScale;
    var ellipsoid           = this.ellipsoid;

    latRad = _coordinate.getLatitude().toRadians();
    lon = _coordinate.getLongitude().toDegreeDecimal();
    lon0 = _coordinate.getLongitude().getCentralMeridian().toDegreeDecimal();

    el2 = ellipsoid.getEl2();
    eta = el2 * Math.pow(Math.cos(latRad), 2.0);
    el4 = eta * eta;
    el6 = el4 * eta;

    deltaLon = lon - lon0;
    deltaLonSeconds = deltaLon * 60 * 60;
    p = 0.0001 * Math.abs(deltaLonSeconds);

    T26 = Math.pow(Math.cos(latRad), 2) / 2 * (1 + el2 * Math.pow(Math.cos(latRad), 2));
    T27 = Math.pow(Math.cos(latRad), 4) / 24.0 * 
            (5 - 4 * Math.pow(Math.tan(latRad), 2) + 14 * el2 * Math.pow(Math.cos(latRad), 2) + 13 * el4 * 
            Math.pow(Math.cos(latRad), 4) - 28 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2) + 
            4 * el6 * Math.pow(Math.cos(latRad), 6) - 48 * Math.pow(Math.tan(latRad), 2) * el4 * 
            Math.pow(Math.cos(latRad), 4) - 24 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6));

    f20 = T26 * Math.pow(sin1, 2) * 1E8;
    f21 = T27 * Math.pow(sin1, 4) * 1E16;

    return scaleFactor0 * (1 + (f20 * Math.pow(p, 2)) + (f21 * Math.pow(p, 4)));
};
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