// Globals
var rootUrl = "https://api.github.com/users/ATMartin";



var myTemplate = function(endpoint, templateName, dest) {
  this._url = rootUrl + (endpoint != ''?'/':'') + endpoint + "?access_token=" + window.token;
	this._template = _.template($('[data-template-name='+ templateName + ']').text());
	this._destination = $(dest);
	return this;
};
//  |-- Proto
myTemplate.prototype = { 
  _url: '',
	_template: '',
	_destination: '',
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
	render: function() {
		var me = this;
		this.data(function(d) {
			if (d.length > 1) {
				d.forEach(function(item) {
					me._destination.append(me._template(item));
				});
			} else {
				me._destination.append(me._template(d)); 
			}
		});
	}
};

// TEMPLATES
//  |-- Big Repo Listing (from Repositories tab)
var bigRepoListing = new myTemplate('repos', 'big-repo-listitem', '.repo-big-list');
//  |-- Sidebar & Account Data 
var mySidebarData = new myTemplate('', 'sidebar-content', '.sidebar');

//myAccountData.render();
bigRepoListing.render();


