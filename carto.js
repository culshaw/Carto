(function() {

	function Cartograph(options) {
		this.map = false,
		this.actualMap = false,
		this.el = false,
		this.provider = false,
		this.type = false,
		this.sensor = false,
		this.geocoder = false,
		this.center = false,
		this.debug = false,
		this.geocodeCount = 0,
		this.geocodeCache = [],
		this.markers = [],
		this.polylines = [],
		this.directions = [],
		this.mapTypes = [],
		this.unitMetrics = [],
		this.travelModes = [],
		this.animations = [],
		this.realignedPolylines = [];
		
		this.init(options);
	}

	Cartograph.prototype.init = function(options) {
	
		// Capture our map points
		/*
		Unsure of tackling these just yet

		this.directions = options.directions || false;/**/
		
		// Detect map type
		this.provider = options.provider || false;
		this.type = options.type || false;
		this.el = options.element || false;
		this.center = options.center || false;
		this.debug = options.debug || false;
		this.zoom = options.zoom || 8;
		this.markers = options.markers || [];
		this.polylines = options.polylines || [];
		this.directions = options.directions || [];
					
		switch(this.provider) { 
			case 'gmap':
				/*
				
				NEED A BETTER WAY TO LOAD THE SCRIPT AND CHECK WHAT HAPPENED
				
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=Carto.setupMap";
				document.body.appendChild(script);
				/**/
				this.setupMap();
			    var obj = this;
			break;
			case 'ovi':
			case 'bing':
				alert('not supported');
			break;
			default:
				this.detectMap();
				this.getMapObj();
				this.setupMap();
		}
	}
	
	Cartograph.prototype.setupMap = function() {
		this.getMapObj();
		// If a text string is given we need to geocode the string to get the lat/long
		if(typeof this.center == 'string') {
			var obj = this;
			switch(this.provider) {
				case 'gmap':
				
					this.animations = google.maps.Animation;
					this.mapTypes = google.maps.MapTypeId;
					
					
					for(var mt in this.mapTypes) {
						if(this.type.toLowerCase() === this.mapTypes[mt].toLowerCase()) {
							this.type = this.mapTypes[mt];
						}
					}
					
					this.geocoder.geocode( {'address': this.center }, function(results, status) {
						obj.center = results[0].geometry.location;
						obj.actualMap = obj.draw();
						if(obj.actualMap) {
							if(obj.markers.length > 0)obj.pushMarkers(obj.markers, obj.actualMap)
							if(obj.polylines.length > 0)obj.pushPolylines(obj.polylines, obj.actualMap)
							if(obj.directions.length > 0)obj.pushDirections(obj.directions, obj.actualMap)
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
	}
	
	Cartograph.prototype.pushDirections = function(directions, theMap) {
	
		this.directionsService = new google.maps.DirectionsService();
		this.directionsDisplay = new google.maps.DirectionsRenderer();
		
		this.travelModes = google.maps.TravelMode;
		this.unitMetrics = google.maps.UnitSystem;
		
		// Set travel modes
		for(var key in this.travelModes) {
			if(key === directions.travel.toUpperCase()) {
				directions.travel = this.travelModes[key];
			}
		}
		
		// Set unit metrics
		for(var key in this.unitMetrics) {
			if(key === directions.units.toUpperCase()) {
				directions.units = this.unitMetrics[key];
			}
		}
					
		var directionsObj = {
			origin: directions.from,
			destination: directions.to,
			waypoints: directions.waypoints || {},
			provideRouteAlternatives: directions.alternatives || false,
			travelMode: directions.travel,
			unitSystem: directions.units
		};
		
		// Prime the directions request
		directionsDisplay = this.directionsDisplay;
		this.directionsService.route(directionsObj, function(result, status) {
			if(status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(result);
			}
		});
		
		
		this.directionsDisplay.setMap(theMap);
	}
	
	Cartograph.prototype.pushPolylines = function(polylines, theMap) {
		var polyLength = polylines.length;
		for(var i = 0; i < polyLength; i++) {
			var polyline = polylines[i];
			if(typeof polyline == 'object') {
				var polylineBuilder = [];
				for(j = 0; j < polyline.waypoints.length; j++) {
					var waypoint = polyline.waypoints[j];
					var polylineDetails = {totalPointers: polyline.waypoints.length, originalWaypoints: polyline.waypoints, polyline: polyline, builder: polylineBuilder, currentMarker: j};
					
					if(typeof waypoint == 'object') {
						var location = new google.maps.LatLng(waypoint.lat, waypoint.long);	
						polylineDetails.builder.push(location);								
						if(polylineDetails.totalPointers === polylineDetails.builder.length) {
							var flightPath = new google.maps.Polyline({
								path: polylineDetails.builder,
								strokeColor: polylineDetails.polyline.colour,
								strokeOpacity: polylineDetails.polyline.opacity,
								strokeWeight: polylineDetails.polyline.weight
							});
							flightPath.setMap(theMap);
						}
					} else {
						this.geocodeAddr(polyline.waypoints[j], function(location, polylineDetails, obj) {
							obj.realignedPolylines = [];
							polylineDetails.builder.push({location: location, address: polylineDetails.originalWaypoints[polylineDetails.currentMarker]});
							if(polylineDetails.totalPointers === polylineDetails.builder.length) {
								// So all of our polylines are now resolved but there is a good chance they are in the wrong order if you are using a multiple of addresses and lat/lngs
								for(var k = 0; k < polylineDetails.totalPointers; k++) {
									for(var l = 0; l < polylineDetails.totalPointers; l++) {
										//console.log(polylineDetails.originalWaypoints[k], polylineDetails.builder[l]);
										if(polylineDetails.originalWaypoints[k] === polylineDetails.builder[l].address) {
										//	console.log(polylineDetails.builder[l]);
											obj.realignedPolylines[k] = polylineDetails.builder[l].location;
											//console.log();
											if(k === l) { } else {
												//console.log('CHEAT', polylineDetails.builder[l].address);
												
											}
										} else if(polylineDetails.builder[l].address == undefined) {
											obj.realignedPolylines[k] = polylineDetails.builder[l];
										}
									}
									//console.log(polylineDetails.originalWaypoints.indexOf())
								}
								
								var flightPath = new google.maps.Polyline({
									path: obj.realignedPolylines,
									strokeColor: polylineDetails.polyline.colour,
									strokeOpacity: polylineDetails.polyline.opacity,
									strokeWeight: polylineDetails.polyline.weight
								});
								flightPath.setMap(theMap);/**/
								//console.log(polylines);
								//console.log(polylineDetails);
								
								
								
								return;
								
							}
						}, polylineDetails, this);
					}
				}
			} else {
				
			}
		}
	}
	
	Cartograph.prototype.pushMarkers = function(markers, theMap) {		
		var markerLength = markers.length,
			obj = this;
		for(var i = 0; i < markerLength; i++) {
			if(typeof markers[i] === 'object') { // we have a full object to interpret
				if(markers[i].location) {
					this.geocodeAddr(markers[i].location, function(location, markerObj, obj) {										
						var newMarker = new google.maps.Marker({
							position: location, 
							map: theMap,
							icon: markerObj.image || '',
							title: markerObj.name
						});
						
						var infowindow = new google.maps.InfoWindow({
							content: markerObj.iwindow.content || '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">' + markerObj.name + '</h1></div>'
						});
						
						google.maps.event.addListener(newMarker, 'click', function() {  infowindow.open(theMap,newMarker); });
						obj.markers.push(newMarker);
					}, markers[i], this, false);
					
					//var markerInfo = markers[i]; // TODO: Pass marker info/object through to geocode callback (somehow)
					/*this.geocoder.geocode( {'address': markers[i].location }, function(results, status) {
						obj.markers.push(new google.maps.Marker({
							position: results[0].geometry.location, 
							map: theMap,
							title: markerInfo.name
						}));
					});/**/
				} else {
					var newMarker = new google.maps.Marker({ position: new google.maps.LatLng(markers[i].lat, markers[i].long), map: theMap, title: markers[i].name, icon: markers[i].image || '' });
					// Basic infowindow implementation to make sure info is being retained in the markerOffset
					var infowindow = new google.maps.InfoWindow({
						content: markers[i].iwindow.content
					});
					google.maps.event.addListener(newMarker, 'click', function() { infowindow.open(theMap,newMarker); });
					this.markers.push(newMarker); 
				}					 
			} else {
				this.geocodeAddr(markers[i], function(location, marker, obj) {
					var newMarker = new google.maps.Marker({
					      position: location, 
					      map: theMap,
					      // There is never a marker here because they are only passing the location name
					      title:marker
					});
					
					var infowindow = new google.maps.InfoWindow({
						content: '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">' + marker + '</h1></div>'
					});
					
					google.maps.event.addListener(newMarker, 'click', function() { infowindow.open(theMap,newMarker); });
					obj.markers.push(newMarker);
				}, markers[i], this);       
			}
		}
	}
	
	Cartograph.prototype.geocodeAddr = function(address, cb, pushbackObj, obj, flag) {
		
		// Beginning of geocoding caching
		this.geocodeCache.push({address: address,callback: cb,pbObj: pushbackObj,obj:  obj});
		
		if(flag) {
			console.log('TIMEOUT');
			obj.geocoderCount = 0;
		}
		if(obj.geocoderCount % 10 == 0) {
			setTimeout("Cartograph.geocodeAddr(address, cb, pushbackObj, obj, true)", 5000);		
		} else {
			this.geocoder.geocode({
		        'address': address
		    }, function (results, status) {
		    	if(status === 'OK') {
		    		console.log(obj.type, address);
			        cb(results[0].geometry.location, pushbackObj, obj);
			    }
		    });
	    	obj.geocoderCount++;
	    }
	} // Getting our geocode face on
	
	Cartograph.prototype.authenticate = function() {}
	Cartograph.prototype.mapFunctions = function() {}
	Cartograph.prototype.detectMap = function() {
		// Legacy function in case they choose to include the maps themself
		this.type = (window.google)?'gmap':(window.Microsoft)?'bing':(window.ovi)?'ovi':false;
		//Return false if none of our maps are supported
		if(this.type === false) { this.callError('unsupported'); return false; }
	}
	Cartograph.prototype.getMapObj = function() {
		// Grasp the map type and associate
		switch (this.provider) {
			case 'gmap':
				this.geocoder = new google.maps.Geocoder();
				this.map = window.google.maps;
			break;
			case 'bing':
				return window.Microsoft.Maps;
			break;
			case 'ovi':
				return window.ovi.mapsapi;
			break;
		}
		return false;
		
		/*return  window.google       || // Sample shim from paul irish for requestAnimationFrame
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(callback, element){
            window.setTimeout(callback, 1000 / 60);
          };/**/
		
	}
	Cartograph.prototype.reverseGeocode = function() {}
	// Put the map on the canvas
	Cartograph.prototype.draw = function() {
		// For future implementations of other maps being integrated.
		switch(this.provider) {
			case 'gmap':
				var myOptions = {
			      zoom: this.zoom,
			      center: this.center,
			      mapTypeId: this.type
			    };

			    
			    return new google.maps.Map(document.getElementById(this.el.replace('#', '')), myOptions);
			break;
			case 'bing':
			case 'ovi':
				alert('Support not yet implemented');
				return false;
			break;
		}
	}
	
	Cartograph.prototype.callError = function(str) {
		//if(this.debug) {
			if (console) { console.log(str); } else { alert(str); }
		//}
	}
	
//	Cartograph.init(options);
	if(!window.Carto){window.Carto=Cartograph;}//We create a shortcut for our framework, we can call the methods by $$.method();
})();