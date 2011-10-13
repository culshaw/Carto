# Carto

Carto is a wrapper that sits on top of certain javascript map providers in order to make it simpler to create applications with their API's

*It’s a work in progress (e.g. beta), so please be kind and 
contribute! Patches are welcome, but aren't guaranteed to make it in.*

## Usage

alpha usage as follows:

```
Carto.init(
	{
		provider: 'gmap',
		type: 'satellite',
		zoom: 4,
		sensor: true,
		center: 'London, UK', // Map center
		markers: [
			'London, UK', // String based marker (automatic geocoding)
			'Paris', 
			{long: -3.160278, lat: 55.949444, image: '', name: 'Edinburgh', // Long and lat based object marker
				iwindow: { content: 'this will pop up in a standard info window' } // Info window
			},
			{location: 'Llandudno, Wales', image: 'newPin.png', name: 'Llandudno', iwindow: { content: 'This is all about llandudno' }} // Location based object marker (automatic geocode) 
		], // Pins
		polylines: [
			{waypoints: ['London, UK', 'Paris', 'Lisbon'], colour: '#ff0000', weight: 3, opacity: 1.0},
			{waypoints: ['Gothenburg', 'Copenhagen', 'Munich', 'Cologne', 'Marseille'], colour: '#0000ff', weight: 1, opacity: 1.0},
		],
		element: '#main' // Target element
	}
);

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