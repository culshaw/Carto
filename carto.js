(function() {

	// Define our object
	var Cartograph = {
		map: false,
		actualMap: false,
		el: false,
		provider: false,
		type: false,
		sensor: false,
		geocoder: false,
		center: false,
		markers: [],
		polylines: [],
		directions: [],
		mapTypes: [],
		animations: [],
		realignedPolylines: [],
		init:function(options) {
		
			// Capture our map points
			/*
			Unsure of tackling these just yet
			
			this.polylines = options.polylines || false;
			this.directions = options.directions || false;/**/
			
			// Detect map type
			this.provider = options.provider || false;
			this.type = options.type || false;
			this.el = options.element || false;
			this.center = options.center || false;
			this.zoom = options.zoom || 8;
			this.markers = options.markers || [];
			this.polylines = options.polylines || [];
						
			switch(this.provider) { 
				case 'gmap':
					var script = document.createElement("script");
					script.type = "text/javascript";
					script.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback=Carto.setupMap";
					document.body.appendChild(script);
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
		},
		setupMap: function() {
			this.getMapObj();
			// If a text string is given we need to geocode the string to get the lat/long
			if(typeof this.center == 'string') {
				var obj = this;
				switch(this.provider) {
					case 'gmap':
					
						this.animations = google.maps.Animation;
						this.mapTypes = google.maps.MapTypeId;
						
						
						this.geocoder.geocode( {'address': this.center }, function(results, status) {
							obj.center = results[0].geometry.location;
							obj.actualMap = obj.draw();
							if(obj.actualMap) {
								obj.pushMarkers(obj.markers, obj.actualMap);
								obj.pushPolylines(obj.polylines, obj.actualMap);
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
		// Push polylines into the map
		pushPolylines: function(polylines, theMap) {
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
		},
		// Put the pins into the map
		pushMarkers: function(markers, theMap) {		
			var markerLength = markers.length;
			for(var i = 0; i < markerLength; i++) {
				if(typeof markers[i] === 'object') { // we have a full object to interpret
					if(markers[i].location) {
						var obj = this;
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
						}, markers[i], this);
						
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
						// Basic infowindow implementation to make sure info is being retained in the marker
						var infowindow = new google.maps.InfoWindow({
							content: markers[i].iwindow.content
						});
						google.maps.event.addListener(newMarker, 'click', function() { infowindow.open(theMap,newMarker); });
						this.markers.push(newMarker); 
					}					 
				} else {
					var obj = this;
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
		},
		
		geocodeAddr: function(address, cb, pushbackObj, obj) {
					
			this.geocoder.geocode({
		        'address': address
		    }, function (results, status) {
		    	if(status === 'OK') {
		    		//console.log(status);
		    		//console.log(obj);
			        cb(results[0].geometry.location, pushbackObj, obj);
			    }
		    });
		}, // Getting our geocode face on
		
		authenticate: function() {},
		mapFunctions: function() {},
		detectMap: function() {
			// Legacy function in case they choose to include the maps themself
			this.type = (window.google)?'gmap':(window.Microsoft)?'bing':(window.ovi)?'ovi':false;
			//Return false if none of our maps are supported
			if(this.type === false) { this.callError('unsupported'); return false; }
		},
		
		getMapObj: function() {
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
			
		},
		reverseGeocode: function() {},
		
		// Put the map on the canvas
		draw: function() {
			// For future implementations of other maps being integrated.
			switch(this.provider) {
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