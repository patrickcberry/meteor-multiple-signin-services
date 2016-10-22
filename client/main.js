Template.users.helpers ({
	users: function(){
		return Meteor.users.find();
	},

	services: function(){

		// The object to be converted to an array
		var obj = Meteor.users.findOne({_id:this._id}).services;

		// Convert the tags object to an array
		var arr = Object.keys(obj).map(function (key) { 
			// Store the object key in the array object
			obj[key].key = key;
			// Return the array
			return obj[key]; 
		})
		return arr;
	},

});

Template.body.helpers ({
	userCount: function() {
		return Meteor.users.find().count();
	}
});

Template.users.onCreated( function() {
	this.subscribe('allUsers');
});