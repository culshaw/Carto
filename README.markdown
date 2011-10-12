# Carto

Carto is a wrapper that sits on top of certain javascript map providers in order to make it simpler to create applications with their API's

*It’s a work in progress (e.g. beta), so please be kind and 
contribute! Patches are welcome, but aren't guaranteed to make it in.*

## Usage

Very alpha usage as follows:

```
Carto.init(
	{
		type: 'gmap',
		zoom: 4,
		sensor: true,
		center: 'London, UK', // Map center
		markers: [
			'London, UK', // String based marker (automatic geocoding)
			'Paris', 
			{long: -3.160278, lat: 55.949444, image: '', name: 'Edinburgh', // Long and lat based object marker
				iwindow: { content: '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">Uluru</h1><div id="bodyContent"><p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335 km (208 mi) south west of the nearest large town, Alice Springs; 450 km (280 mi) by road. Kata Tjuta and Uluru are the two major features of the Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and Yankunytjatjara, the Aboriginal people of the area. It has many springs, waterholes, rock caves and ancient paintings. Uluru is listed as a World Heritage Site.</p><p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">http://en.wikipedia.org/w/index.php?title=Uluru</a> (last visited June 22, 2009).</p></div></div>' } // Info window
			},
			{location: 'Llandudno, Wales', image: '', name: 'Llandudno'} // Location based object marker (automatic geocode) 
		], // Pins
		element: '#main' // Target element
	}
);
```

## Contributing

To contribute, please fork Maps, add your patch and tests for it (in the `test/` folder) and
submit a pull request.

## TODOs

* Implement more features, (polylines, map types, custom maps types etc)
* Determine best way to piggyback map api's
* Begin test suite
* Make docs

Carto is (c) 2011 Ian Culshaw and may be freely distributed under the MIT license.
See the `MIT-LICENSE` file.