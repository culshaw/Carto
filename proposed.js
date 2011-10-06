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