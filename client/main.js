Template.users.helpers ({
	users: function(){
		return Meteor.users.find();
	},

	//
	// Return users.services
	//
	// users.services is an object so needs to be convereted to an array 
	// before it can be used in a template #each

	services: function(){

		// The object to be converted to an array
		var obj = Meteor.users.findOne({_id:this._id}).services;

		// remove the 'resume' entry in the services array
		delete obj.resume;

		// Convert the services object to an array
		var arr = Object.keys(obj).map(function (key) { 
			// Store the object key in the array object
			obj[key].key = key;
			// Return the array
			return obj[key]; 
		});

		return arr;
	},

	isUser: function() {
		return Meteor.userId() == this._id;
	},

	activeIfIsUser: function() {
		if (Meteor.userId() == this._id) {
			return 'info';
		} else {
			return '';
		}
	}


});

//
// Return count of users in Meteor.users collection
//

Template.body.helpers ({
	userCount: function() {
		return Meteor.users.find().count();
	}
});

//
// Subscribe to allUsers 
//

Template.users.onCreated( function() {
	this.subscribe('allUsers');
});