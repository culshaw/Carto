/*!
  * Reqwest! A general purpose XHR connection manager
  * (c) Dustin Diaz 2011
  * https://github.com/ded/reqwest
  * license MIT
  */
!function(a,b){if(typeof define=="function")define(b);else if(typeof module!="undefined")module.exports=b();else this[a]=b()}("reqwest",function(){function serializeHash(){var a={};eachFormElement.apply(function(b,c){if(b in a){a[b]&&!isArray(a[b])&&(a[b]=[a[b]]);a[b].push(c)}else a[b]=c},arguments);return a}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function eachFormElement(){var a=this,b=function(b,c){for(var d=0;d<c.length;d++){var e=b[byTag](c[d]);for(var f=0;f<e.length;f++)serial(e[f],a)}};for(var c=0;c<arguments.length;c++){var d=arguments[c];if(/input|select|textarea/i.test(d.tagName))serial(d,a);b(d,["input","select","textarea"])}}function serial(a,b){var c=a.name,d=a.tagName.toLowerCase(),e=function(a){if(a&&!a.disabled)b(c,normalize(a.attributes.value&&a.attributes.value.specified?a.value:a.text))};if(a.disabled||!c)return;switch(d){case"input":if(!/reset|button|image|file/i.test(a.type)){var f=/checkbox/i.test(a.type),g=/radio/i.test(a.type),h=a.value;(!(f||g)||a.checked)&&b(c,normalize(f&&h===""?"on":h))}break;case"textarea":b(c,normalize(a.value));break;case"select":if(a.type.toLowerCase()==="select-one"){e(a.selectedIndex>=0?a.options[a.selectedIndex]:null)}else{for(var i=0;a.length&&i<a.length;i++){a.options[i].selected&&e(a.options[i])}}break}}function normalize(a){return a?a.replace(/\r?\n/g,"\r\n"):""}function reqwest(a,b){return new Reqwest(a,b)}function init(o,fn){function error(a,b,c){o.error&&o.error(a,b,c);complete(a)}function success(resp){var r=resp.responseText;if(r){switch(type){case"json":try{resp=win.JSON?win.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r;break}}fn(resp);o.success&&o.success(resp);complete(resp)}function complete(a){o.timeout&&clearTimeout(self.timeout);self.timeout=null;o.complete&&o.complete(a)}this.url=typeof o=="string"?o:o.url;this.timeout=null;var type=o.type||setType(this.url),self=this;fn=fn||function(){};if(o.timeout){this.timeout=setTimeout(function(){self.abort()},o.timeout)}this.request=getRequest(o,success,error)}function setType(a){if(/\.json$/.test(a)){return"json"}if(/\.jsonp$/.test(a)){return"jsonp"}if(/\.js$/.test(a)){return"js"}if(/\.html?$/.test(a)){return"html"}if(/\.xml$/.test(a)){return"xml"}return"js"}function Reqwest(a,b){this.o=a;this.fn=b;init.apply(this,arguments)}function getRequest(a,b,c){if(a.type=="jsonp"){var d=doc.createElement("script"),e=0,f=uniqid++;win[getCallbackName(a,f)]=generalCallback;d.type="text/javascript";d.src=a.url;d.async=true;if(typeof d.onreadystatechange!=="undefined"){d.event="onclick";d.htmlFor=d.id="_reqwest_"+f}d.onload=d.onreadystatechange=function(){if(d[readyState]&&d[readyState]!=="complete"&&d[readyState]!=="loaded"||e){return false}d.onload=d.onreadystatechange=null;d.onclick&&d.onclick();a.success&&a.success(lastValue);lastValue=undefined;head.removeChild(d);e=1};head.appendChild(d)}else{var g=xhr(),h=(a.method||"GET").toUpperCase(),i=typeof a==="string"?a:a.url,j=a.processData!==false&&a.data&&typeof a.data!=="string"?reqwest.toQueryString(a.data):a.data||null;h=="GET"&&j&&j!==""&&(i+=(/\?/.test(i)?"&":"?")+j)&&(j=null);g.open(h,i,true);setHeaders(g,a);g.onreadystatechange=handleReadyState(g,b,c);a.before&&a.before(g);g.send(j);return g}}function generalCallback(a){lastValue=a}function getCallbackName(a,b){var c=a.jsonpCallback||"callback";if(a.url.slice(-(c.length+2))==c+"=?"){var d="reqwest_"+b;a.url=a.url.substr(0,a.url.length-1)+d;return d}else{var e=new RegExp(c+"=([\\w]+)");return a.url.match(e)[1]}}function setHeaders(a,b){var c=b.headers||{};c.Accept=c.Accept||"text/javascript, text/html, application/xml, text/xml, */*";if(!b.crossOrigin){c["X-Requested-With"]=c["X-Requested-With"]||"XMLHttpRequest"}c[contentType]=c[contentType]||"application/x-www-form-urlencoded";for(var d in c){c.hasOwnProperty(d)&&a.setRequestHeader(d,c[d])}}function handleReadyState(a,b,c){return function(){if(a&&a[readyState]==4){if(twoHundo.test(a.status)){b(a)}else{c(a)}}}}var context=this,win=window,doc=document,old=context.reqwest,twoHundo=/^20\d$/,byTag="getElementsByTagName",readyState="readyState",contentType="Content-Type",head=doc[byTag]("head")[0],uniqid=0,lastValue,xhr="XMLHttpRequest"in win?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")};Reqwest.prototype={abort:function(){this.request.abort()},retry:function(){init.call(this,this.o,this.fn)}};var isArray=typeof Array.isArray=="function"?Array.isArray:function(a){return Object.prototype.toString.call(a)=="[object Array]"};reqwest.serializeArray=function(){var a=[];eachFormElement.apply(function(b,c){a.push({name:b,value:c})},arguments);return a};reqwest.serialize=function(){if(arguments.length===0)return"";var a,b,c=Array.prototype.slice.call(arguments,0);a=c.pop();a&&a.nodeType&&c.push(a)&&(a=null);a&&(a=a.type);if(a=="map")b=serializeHash;else if(a=="array")b=reqwest.serializeArray;else b=serializeQueryString;return b.apply(null,c)};reqwest.toQueryString=function(a){var b="",c,d=encodeURIComponent,e=function(a,c){b+=d(a)+"="+d(c)+"&"};if(isArray(a)){for(c=0;a&&c<a.length;c++)e(a[c].name,a[c].value)}else{for(var f in a){if(!Object.hasOwnProperty.call(a,f))continue;var g=a[f];if(isArray(g)){for(c=0;c<g.length;c++)e(f,g[c])}else e(f,a[f])}}return b.replace(/&$/,"").replace(/%20/g,"+")};reqwest.noConflict=function(){context.reqwest=old;return this};return reqwest});

/*

map.new({
	'markers': ['London', 'Paris', 'Singapore'], // Arguments will take string and attempt to reverse geocode (if available) or take an object containing lat/lng
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
				this.geocoder.geocode( {'address': this.center }, function(results, status) {
					obj.center = results[0].geometry.location;
					this.actualMap = obj.draw();
					obj.pushMarkers(options.markers, this.actualMap);
					return obj;
		        });/**/
			}
		},
		
		// Put the pins into the map
		pushMarkers: function(markers) {		
			var markerLength = markers.length;
			
			for(var i = 0; i < markerLength; i++) {
				if(typeof markers[i] == 'object') { // we have a lat/long set which we can decipher
					this.markers.push(new google.maps.Marker({
					      position: new google.maps.LatLng(markers[i].lat, markers[i].lng), 
					      map: this.actualMap, 
					      title:markers[i].text
					})); 
				} else {
					var obj = this;
					this.geocoder.geocode( {'address': markers[i] }, function(results, status) {
						obj.markers.push(new google.maps.Marker({
						      position: results[0].geometry.location, 
						      map: this.actualMap, 
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
		
			
			/*return  window.google       || 
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
			}
		},
		callError: function(str) {
			if (console) { console.log(str); } else { alert(str); }
		}
		
	}
	
	if(!window.Carto){window.Carto=Cartograph;}//We create a shortcut for our framework, we can call the methods by $$.method();
})();

Carto.init({center: 'London, UK', markers: ['London, UK', 'Paris'], el: '#main'});