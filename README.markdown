# Maps // working name

Maps is intending to put a wrapper above certain javascript map providers in order to make it simpler to create applications with their API's

*It’s a work in progress (e.g. beta), so please be kind and 
contribute! Patches are welcome, but aren't guaranteed to make it in.*

## Usage

There is no usage, proposed usage as follows:

```
map.new({
	// Should it detect which map we using or define?
	'pins': ['London', 'Paris', 'Singapore'],
	'polylines': [
		{from: 'London', to: 'Cambridge', color: '#BADA55', width: '2px'}
	],
	'directions': {
		from: 'London',
		to: 'Nottingham',
		via: [
			'Leicester',
			'Loughborough'
		]
	}
});
```

## Contributing

To contribute, please fork Maps, add your patch and tests for it (in the `test/` folder) and
submit a pull request.

## TODOs

* Implement basic framework
* Determine best way to piggyback map api's
* Finish test suite

Maps is (c) 2011 Ian Culshaw and may be freely distributed under the MIT license.
See the `MIT-LICENSE` file.