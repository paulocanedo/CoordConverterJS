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
};