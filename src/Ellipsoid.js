Ellipsoid.calcS = function(A, B, C, D, E, _latRad) {
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
