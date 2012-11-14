CoordConverterJS
================

Coordinate conversor Geographic - UTM in javascript


Usage
-----

	ellipsoid = new Ellipsoid(DatumFactory.SIRGAS);
	latitude  = new Latitude (AngleValue.dms2dd(10, 10, 52.14396, false));
	longitude = new Longitude(AngleValue.dms2dd(48, 20, 16.79136, false));

	geoCoord = new GeographicCoordinate(ellipsoid, latitude, longitude);
	utmCoord = new UTMCoordinate(ellipsoid, 22, Hemisphere.SOUTH, 791679.526, 8873360.353, 0.0);

	var utm = geoCoord.toUTM();
	utm.getEast();  //float
	utm.getNorth(); //float
	utm.getZone();  //integer

	var geo = utmCoord.toGeodesic();
	geo.getLatitude()  //Latitude object
	geo.getLongitude() //Longitude object

