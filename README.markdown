# Carto

Carto is a wrapper that sits on top of certain javascript map providers in order to make it simpler to create applications with their API's

*It’s a work in progress (e.g. beta), so please be kind and 
contribute! Patches are welcome, but aren't guaranteed to make it in.*

## Usage

Very alpha usage as follows:

```
Carto.init(
	{
		center: 'London, UK', // Map center
		markers: ['London, UK', 'Paris'], // Pins
		el: '#main' // Target element
	}
);
```

## Contributing

To contribute, please fork Maps, add your patch and tests for it (in the `test/` folder) and
submit a pull request.

## TODOs

* Implement more features
* Determine best way to piggyback map api's
* Begin test suite
* Make docs

Carto is (c) 2011 Ian Culshaw and may be freely distributed under the MIT license.
See the `MIT-LICENSE` file.