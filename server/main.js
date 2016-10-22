import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('allUsers', function () {
  return Meteor.users.find({});
});

//
// onCreateUser
//
// The function below based on example found here, 
// http://stackoverflow.com/questions/15592965/how-to-add-external-service-logins-to-an-already-existing-account-in-meteor

Accounts.onCreateUser(function (options, user) {

	var dbug = true;

	if (dbug) console.log('  Account.conCreateUser: ');

    if (user.services) {

		if (dbug) console.log('  Account.conCreateUser: user.service == true');

    	// TODO: Not sure what this is doing. Is it needed?

        if (options.profile) {
        	if (dbug) console.log('  Account.conCreateUser: options.profile == true');
            user.profile = options.profile

            if (dbug) console.log('  Account.conCreateUser: options.profile >> user.profile');
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
            if (dbug) console.log('  Account.conCreateUser: no linked email return new user');
            return user;
        }

		if (dbug) console.log('  Account.conCreateUser: email == ' + email );

        // see if any existing user has this email address, otherwise create new
        var existingUser = Meteor.users.findOne({'emails.address': email});

		if (dbug) console.log('  Account.conCreateUser: existingUser == ' + existingUser );

        if (!existingUser) {
            // check for email also in other services
            var existingGitHubUser = Meteor.users.findOne({'services.github.email': email});
            var existingGoogleUser = Meteor.users.findOne({'services.google.email': email});
            var existingTwitterUser = Meteor.users.findOne({'services.twitter.email': email});
            var existingFacebookUser = Meteor.users.findOne({'services.facebook.email': email});
            var doesntExist = !existingGitHubUser && !existingGoogleUser && !existingTwitterUser && !existingFacebookUser;
            if (doesntExist) {
                // return the user as it came, because there he doesn't exist in the DB yet
                if (dbug) console.log('  Account.conCreateUser: email not fould in existing service login records, return new user' );
                return user;
            } else {
                existingUser = existingGitHubUser || existingGoogleUser || existingTwitterUser || existingFacebookUser;
                if (existingUser) {
                    if (user.emails) {
                        // user is signing in by email, we need to set it to the existing user
                        if (dbug) console.log('  Account.conCreateUser: YYYYY ' );
                        existingUser.emails = user.emails;
                    }
                }
            }
        }

        // precaution, these will exist from accounts-password if used
        if (!existingUser.services) {
        	if (dbug) console.log('  Account.conCreateUser: 10001 ' );
            existingUser.services = { resume: { loginTokens: [] }};
        }

        // copy accross new service info
        if (dbug) console.log('  Account.conCreateUser: 10002 ' );        
        existingUser.services[service] = user.services[service];

        if (dbug) console.log('  Account.conCreateUser: 10003 ' );

        if ( existingUser.services.resume.loginTokens && existingUser.services.resume.loginTokens.length > 0 ) {
        	// Logged into existing service - not sure how this can happen?
			if (dbug) console.log('  Account.conCreateUser: 10004 ' + existingUser.services.resume.loginTokens.length );
   	        if (dbug) console.log('  Account.conCreateUser: 10005 ' );
        	existingUser.services.resume.loginTokens.push(
            	user.services.resume.loginTokens[0]
        	);

        } else {
        	// Not logged into existing service - 
        	/**
  	        if (dbug) console.log('  Account.conCreateUser: 10006 ' );

			if (dbug) console.log(   user );  	        
			if (dbug) console.log('  Account.conCreateUser: 10007 ' +  user.services );
			if (dbug) console.log('  Account.conCreateUser: 10008 ' +  user.services.resume );
			if (dbug) console.log('  Account.conCreateUser: 10009 ' +  user.services.resume.loginTokens );
			if (dbug) console.log('  Account.conCreateUser: 10010 ' +  user.services.resume.loginTokens[0] );

        	existingUser.services.resume.loginTokens = user.services.resume.loginTokens[0];
        	*/
        }

        if (dbug) console.log('  Account.conCreateUser: 10011 ' );

        // even worse hackery
        if (dbug) console.log('  Account.conCreateUser: 10012 ' );
        Meteor.users.remove({_id: existingUser._id}); 	// remove existing record
        if (dbug) console.log('  Account.conCreateUser: 10013 ' );
        return existingUser;                  			// record is re-inserted
    }
});

