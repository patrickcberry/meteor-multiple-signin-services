import { Meteor } from 'meteor/meteor';

// Publish all user data
//
// Note: Do not do this in production. All users data is published, even when not logged in. Need to check user
// is logged in and in the correct role before returning the user data. 
//

Meteor.publish('allUsers', function () {
  return Meteor.users.find({});
});

//
// onCreateUser
//
// Do not allow duplicate accounts to be created for the same email address
//
// The function below based on example found here, 
// http://stackoverflow.com/questions/15592965/how-to-add-external-service-logins-to-an-already-existing-account-in-meteor

Accounts.onCreateUser(function (options, user) {

    if (user.services) {

    	// TODO: Not sure what this is doing. Is it needed?

        if (options.profile) {
            user.profile = options.profile
        }
        var service = _.keys(user.services)[0];
        var email = user.services[service].email;

		if (!email) {
            if (user.emails) {
                email = user.emails.address;
            }
        }
        if (!email) {
            email = options.email;
        }
        if (!email) {
            // if email is not set, there is no way to link it with other accounts
            return user;
        }

        // see if any existing user has this email address, otherwise create new
        var existingUser = Meteor.users.findOne({'emails.address': email});

        if (!existingUser) {
            // check for email also in other services
            var existingGitHubUser = Meteor.users.findOne({'services.github.email': email});
            var existingGoogleUser = Meteor.users.findOne({'services.google.email': email});
            var existingTwitterUser = Meteor.users.findOne({'services.twitter.email': email});
            var existingFacebookUser = Meteor.users.findOne({'services.facebook.email': email});
            var doesntExist = !existingGitHubUser && !existingGoogleUser && !existingTwitterUser && !existingFacebookUser;
            if (doesntExist) {
                // return the user as it came, because there he doesn't exist in the DB yet
                return user;
            } else {
                existingUser = existingGitHubUser || existingGoogleUser || existingTwitterUser || existingFacebookUser;
                if (existingUser) {
                    if (user.emails) {
                        // user is signing in by email, we need to set it to the existing user
                        existingUser.emails = user.emails;
                    }
                }
            }
        }

        // precaution, these will exist from accounts-password if used
        if (!existingUser.services) {
            existingUser.services = { resume: { loginTokens: [] }};
        }

        // copy accross new service info
        existingUser.services[service] = user.services[service];
/**
        if ( existingUser.services.resume.loginTokens && existingUser.services.resume.loginTokens.length > 0 ) {
        	// Logged into existing service - not sure how this can happen?
        	existingUser.services.resume.loginTokens.push(
            	user.services.resume.loginTokens[0]
        	);

        } else {

        }
*/
        Meteor.users.remove({_id: existingUser._id}); 	// remove existing record
        return existingUser;                  			// record is re-inserted
    }
});

