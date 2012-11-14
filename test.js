function log(msg) {
	console.log(msg);
}
function logs(msg) {
	if(!msg) {
		console.log(msg);
	} else {
		console.log(msg.toString());
	}
}

function isCorrect(geoCoord, utmCoord) {
	ellipsoid = new Ellipsoid(DatumFactory.SIRGAS);
	latitude  = new Latitude (AngleValue.dms2dd(10, 10, 50.12345, false));
	longitude = new Longitude(AngleValue.dms2dd(48, 20, 16.98765, false));

	geoCoordTest = new GeographicCoordinate(ellipsoid, latitude, longitude);
	utmCoordTest = new UTMCoordinate(ellipsoid, 22, Hemisphere.SOUTH, 791674.058, 8873422.520, 0.0);

	utmTransformed = geoCoord.toUTM();
	geoTransformed = utmCoord.toGeodesic();

	if(!utmCoordTest.equals(utmTransformed)) {
		throw new Error('UTM to Geographic transform test failed.');
	}

	if(!geoCoordTest.equals(geoTransformed)) {
		throw new Error('Geographic to UTM transform test failed.');
	}
	return true;
}

function test() {
	//entry coord:     latitude: 10°10'50.12345" S longitude: 48°20'15.98765" W
	//output expected: E: 791674.058, N: 8873422.520 Zone: 22

	ellipsoid = new Ellipsoid(DatumFactory.SIRGAS);
	latitude  = new Latitude (AngleValue.dms2dd(10, 10, 50.12345, false));
	longitude = new Longitude(AngleValue.dms2dd(48, 20, 16.98765, false));

	geoCoord = new GeographicCoordinate(ellipsoid, latitude, longitude);
	utmCoord = new UTMCoordinate(ellipsoid, 22, Hemisphere.SOUTH, 791674.058, 8873422.520, 0.0);
	if(isCorrect(geoCoord, utmCoord)) {
		console.log('test passed');
	}
	//logs(gcoord + " -> " + utcoord + " Zone: " + utcoord.getZone());
}