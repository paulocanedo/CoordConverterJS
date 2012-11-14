Math.truncate = function(_value) {
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
};