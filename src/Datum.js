function Datum(_name, _a, _b, _inverseFlattening) {
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
};