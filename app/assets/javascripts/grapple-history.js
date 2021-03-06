(function(window, Grapple, $) {
	'use strict';

var urlQuery = Grapple.Util.urlQuery, 
	parseUrlQuery = Grapple.Util.parseUrlQuery;

var GrappleHistory = function(namespace) {
	this.namespace = namespace;
	if(History.init) {
		// https://github.com/browserstate/history.js/
		this.api = History;
		
		// Initialization of history.js can be delayed
		// if it was do it now
		if(this.api.options && this.api.options.delayInit) {
			this.api.options.delayInit = false;
			this.api.init();
		}
	}
	else {
		// TODO: support native history api
		this.api = window.history;
	}
	this.api = History;
	this.changeCallback = null;
};

// Don't clutter the url with rails form parameters
GrappleHistory.IGNORE_PARAMS = { 'utf8': true, 'authenticity_token': true };

GrappleHistory.prototype = {

	add: function(params) {
		var namespace = this.namespace;
		var state = this.api.getState();
		var historyParams = parseUrlQuery(urlQuery(state.url));
		var newParams = parseUrlQuery(params);

		// Remove any parameters from the current state 
		// that are for this table
		for(var x in historyParams) {
			var remove = namespace ? 
				// Remove any parameters in the tables namespace
				x.indexOf(namespace + '[') === 0 : 
				// Table is in the global namespace, remove any parameters that aren't namespaced
				x.indexOf('[') === -1;					

			if(remove) {
				delete historyParams[x];
			}
		}
		
		// Add the new parameters
		for(var x in newParams) {
			if(GrappleHistory.IGNORE_PARAMS[x]) continue;
			//var key = namespace ? namespace + '[' + x  + ']' : x;
			historyParams[x] = newParams[x];
		}
		
		this.api.pushState(null, document.title, '?' + $.param(historyParams));
	},
	
	subscribe: function(callback) {
		var api = this.api, namespace = this.namespace;
		this.changeCallback = function(event) {
			var state = api.getState();
			var params = parseUrlQuery(urlQuery(state.url));
			// Only include the parameters for this namespace
			if(namespace) {
				var r = new RegExp('^' + namespace + '\\[([^\\]]+)\\]$')
				for(var x in params) {
					if(r.exec(x) === null) {
						delete params[x];
					}
				}
			}
			callback(params);
		};
		$(window).bind('statechange', this.changeCallback);
	},
	
	unsubscribe: function() {
		if(this.changeCallback) {
			$(window).unbind('statechange', this.changeCallback);
			this.changeCallback = null;
		}
	}
	
};

Grapple.History = GrappleHistory;

})(window, Grapple, $);
