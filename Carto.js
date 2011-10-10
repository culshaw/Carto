/*

Carto.init({center: 'London, UK', markers: ['London, UK', 'Paris'], el: '#main'});

/**/

(function() {

	// Define our object
	var Cartograph = {
		map: false,
		actualMap: false,
		el: false,
		type: false,
		sensor: false,
		geocoder: false,
		center: false,
		markers: [],
		polylines: [],
		directions: [],
		init:function(options) {
		
			// Capture our map points
			
			/*
			Unsure of tackling these just yet
			
			this.polylines = options.polylines || false;
			this.directions = options.directions || false;/**/
			this.el = options.el || false;
			this.center = options.center || false;
			this.zoom = options.zoom || 8;
			
			this.map = this.detectMap();
			// If a text string is given we need to geocode the string to get the lat/long
			if(typeof this.center == 'string') {
				var obj = this;
				switch(this.type) {
					case 'gmap':
						this.geocoder.geocode( {'address': this.center }, function(results, status) {
							obj.center = results[0].geometry.location;
							obj.actualMap = obj.draw();
							if(obj.actualMap) {
								obj.pushMarkers(options.markers, obj.actualMap);
								return obj;
							}
				        });/**/
					break;
					case 'bing':
					case 'ovi':
						alert('Support not implemented');
					break;
				}
			}
		},
		// Put the pins into the map
		pushMarkers: function(markers, theMap) {		
			var markerLength = markers.length;
			for(var i = 0; i < markerLength; i++) {
				if(typeof markers[i] == 'object') { // we have a full object to interpret
					if(markers[i].location) {
						var obj = this;
						var markerInfo = markers[i]; // We lose the information in this marker after the request is sent and the loop finishes.
						this.geocoder.geocode( {'address': markers[i].location }, function(results, status) {
							obj.markers.push(new google.maps.Marker({
								position: results[0].geometry.location, 
								map: theMap,
								title: markerInfo.name
							}));
						});
					} else {
						this.markers.push(new google.maps.Marker({
							position: new google.maps.LatLng(markers[i].lat, markers[i].long), 
							map: theMap, 
							title: markers[i].name
						})); 
					}					 
				} else {
					var obj = this;
					this.geocoder.geocode( {'address': markers[i] }, function(results, status) {
						obj.markers.push(new google.maps.Marker({
						      position: results[0].geometry.location, 
						      map: theMap, 
						      title:markers[i]
						}));
					 });/**/			       
				}
			}
		},
		authenticate: function() {},
		mapFunctions: function() {},
		detectMap: function() {
			// Returns the map object we're going to do a shim (eventually).
			
			// Detect map type
			this.type = (window.google)?'gmap':(window.Microsoft)?'bing':(window.ovi)?'ovi':false;
			//Return false if none of our maps are supported
			if(this.type === false) { this.callError('unsupported'); return false; }
			
			// Grasp the map type and associate
			switch (this.type) {
				case 'gmap':
					this.geocoder = new google.maps.Geocoder();
					return window.google.maps;
				break;
				case 'bing':
					return window.Microsoft.Maps;
				break;
				case 'ovi':
					return window.ovi.mapsapi;
				break;
			}
		
			
			/*return  window.google       || // Sample shim from paul irish for requestAnimationFrame
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback, element){
                window.setTimeout(callback, 1000 / 60);
              };/**/
			
		},
		reverseGeocode: function() {},
		
		// Put the map on the canvas
		draw: function() {
			// For future implementations of other maps being integrated.
			switch(this.type) {
				case 'gmap':
					var myOptions = {
				      zoom: this.zoom,
				      center: this.center,
				      mapTypeId: google.maps.MapTypeId.ROADMAP
				    };
				    return new google.maps.Map(document.getElementById(this.el.replace('#', '')), myOptions);
				break;
				case 'bing':
				case 'ovi':
					alert('Support not yet implemented');
					return false;
				break;
			}
		},
		callError: function(str) {
			if (console) { console.log(str); } else { alert(str); }
		}
		
	}
	
	if(!window.Carto){window.Carto=Cartograph;}//We create a shortcut for our framework, we can call the methods by $$.method();
})();