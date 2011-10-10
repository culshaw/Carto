# Carto

Carto is a wrapper that sits on top of certain javascript map providers in order to make it simpler to create applications with their API's

*It’s a work in progress (e.g. beta), so please be kind and 
contribute! Patches are welcome, but aren't guaranteed to make it in.*

## Usage

Very alpha usage as follows:

```
Carto.init(
	{
		zoom: 4,
		center: 'London, UK', // Map center
		markers: [
			'London, UK', // String based marker (automatic geocoding)
			'Paris', 
			{long: -3.160278, lat: 55.949444, image: '', name: 'Edinburgh', // Long and lat based object marker
				window: { text: '', style: '' } // Info window
			},
			{location: 'Llandudno, Wales', image: '', name: 'Llandudno', // Location based object marker (automatic geocode)
				window: { text: '', style: '' }
			}
		], // Pins
		el: '#main' // Target element
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