# Carto

Carto is a wrapper that sits on top of certain javascript map providers in order to make it simpler to create applications with their API's

*It’s a work in progress (e.g. beta), so please be kind and 
contribute! Patches are welcome, but aren't guaranteed to make it in.*

## Usage

alpha usage as follows:

```
var infoWindowContent = '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">Uluru</h1><div id="bodyContent"><p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335 km (208 mi) south west of the nearest large town, Alice Springs; 450 km (280 mi) by road. Kata Tjuta and Uluru are the two major features of the Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and Yankunytjatjara, the Aboriginal people of the area. It has many springs, waterholes, rock caves and ancient paintings. Uluru is listed as a World Heritage Site.</p><p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">http://en.wikipedia.org/w/index.php?title=Uluru</a> (last visited June 22, 2009).</p></div></div>';
  	
var myMap = Carto.init({
	provider: 'gmap',
	type: 'satellite',
	zoom: 4,
	sensor: true,
	center: 'London, UK', // Map center
	markers: [
		'London, UK', // String based marker (automatic geocoding)
		'Paris', 
		{long: -3.160278, lat: 55.949444, image: '', name: 'Edinburgh', // Long and lat based object marker
			iwindow: { content: infoWindowContent } // Info window
		},
		{location: 'Llandudno, Wales', image: 'newPin.png', name: 'Llandudno', iwindow: { content: 'This is all about llandudno' }} // Location based object marker (automatic geocode) 
	], // Pins
	polylines: [
		{waypoints: ['London, UK', 'Paris', 'Lisbon'], colour: '#ff0000', weight: 3, opacity: 1.0},
		{waypoints: ['Copenhagen', {lat: 37.772323, long: -122.214897}, 'Munich', 'Cologne', 'Marseille'], colour: '#0000ff', weight: 1, opacity: 1.0},
	],
	directions: {
		from: 'London, UK',
		to: 'Baghdad, Iraq',
		waypoints: [
			{location: 'Paris, France', stopover: false},
			{location: 'Berlin, Germany', stopover: false},
			{location: 'Prague', stopover: false}
		],
		travel: 'driving', // Driving, Bicycling (USA) or walking works
		units: 'imperial', // or metric.
		alternatives: true
	},
	element: '#main' // Target element
});

```

## Contributing

To contribute, please fork Maps, add your patch and tests for it (in the `test/` folder) and
submit a pull request.

## TODOs

* Implement more features, (map types, custom maps types etc)
* Implement constructor options in order to allow multiple instances and store state.
* Determine best way to piggyback map api's
* Begin test suite
* Make docs

Carto is (c) 2011 Ian Culshaw and may be freely distributed under the MIT license.
See the `MIT-LICENSE` file.