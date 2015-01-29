// Globals
var rootUrl = "https://api.github.com/users/ATMartin";

var myTemplate = function(endpoint, templateName, dest, cache) {
  this._url = rootUrl + (endpoint != ''?'/':'') + endpoint + "?access_token=" + window.token;
	this._template = _.template($('[data-template-name='+ templateName + ']').text());
	this._destination = $(dest);
	// For now, cache ALL requests up front.
	// Return in a callback to prevent race condition where cache doesn't exist on return.
	this.cache(function() { return this; });
};
//  |-- Proto
myTemplate.prototype = { 
  _url: '',
	_template: '',
	_destination: '',
	_cachedData: null,
	data: function(callback) {
		$.ajax({
	    url: this._url,
	    type: "GET"
		})
		.fail(function(err) {
			console.log(err);
		})
		.done(function(data) {
			callback(data);
		});
	},
	cache: function(callback) {
		var me = this;
	  this.data(function(d) {
		  me._cachedData = d;
			callback();
	  });
	},
	getCached: function() { 
		return this._cachedData || 'No cache on this object'; 
	},
	render: function() {
		var me = this;                              
		var doRender = function(data, context) {
			if (!context) { context = me; }  //context MUST be set so we can check for _cachedData.
			if (data.length > 1) {
				data.forEach(function (item) {
					context._destination.append(context._template(item));
				});
			} else {
				context._destination.append(context._template(data));
			}
		};
		// Minimize HTTP requests by checking our object's cache first.
		if (this._cachedData) { doRender(this._cachedData, this); }
		else { this.data(doRender); } 
	}
};

// TEMPLATES
//  |-- Big Repo Listing (from Repositories tab)
var bigRepoListing = new myTemplate('repos', 'big-repo-listitem', '.repo-big-list');
//  |-- Sidebar & Account Data 
var mySidebarData = new myTemplate('', 'sidebar-content', '.sidebar');
//  |-- Starred Details
var myStarredRepos = new myTemplate('starred', 'starred-repos', '');
// HELPER VARIABLES
//	|-- Stars Count (for Sidebar Profile) 

bigRepoListing.render();
mySidebarData.render();
