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

// How to add a new login service provider
// 1. If email is NOT stored in the email file check for email at ##1
// 2. Create a new check for email address of existing service at ##2
// 3. Store information provided from login service to appProfile at ##3
// 4. ##4
// 5. Copy appProfile data at ##5
//

Accounts.onCreateUser(function (options, user) {

    if (user.services) {

    	// TODO: Not sure what this is doing. Is it needed?

        if (options.profile) {
            user.profile = options.profile
        }
        var service = _.keys(user.services)[0];
        var email = user.services[service].email;

        // LinkedIn save email in emailAddress no email field

        // Check for email address ##1

        if ( service == "linkedin" ) {
            email = user.services[service].emailAddress;            
        }

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
            // check for email also in other services ##2
            var existingGitHubUser = Meteor.users.findOne({'services.github.email': email});
            var existingGoogleUser = Meteor.users.findOne({'services.google.email': email});
            var existingTwitterUser = Meteor.users.findOne({'services.twitter.email': email});
            var existingFacebookUser = Meteor.users.findOne({'services.facebook.email': email});
            var existingLinkedInUser = Meteor.users.findOne({'services.linkedin.emailAddress': email});
            var doesntExist = !existingGitHubUser && !existingGoogleUser && !existingTwitterUser && !existingFacebookUser && !existingLinkedInUser;
            if (doesntExist) {
                
                // return the user as it came, because there he doesn't exist in the DB yet

                //
                // Set up the app-profile object
                //
                // Store information from different login services using a common naming convention ##3

                var appProfile = { email: email };

                if ( service == "password") {
                    // No additional information available from password
                    appProfile.picture = 'default-profile.gif';

                } else if ( service == "facebook") {
                    appProfile.name = user.services[service].name;                    
                    appProfile.firstName = user.services[service].first_name;                    
                    appProfile.lastName = user.services[service].last_name;                    
                    appProfile.locale = user.services[service].locale;                    
                    appProfile.picture = 'default-profile.gif';

                } else if ( service == "google") {
                    appProfile.name = user.services[service].name;                    
                    appProfile.firstName = user.services[service].given_name;                    
                    appProfile.lastName = user.services[service].family_name;                    
                    appProfile.locale = user.services[service].locale;                    
                    appProfile.picture = user.services[service].picture;                    

                } else if ( service == "githib") {
                    // No additional information available from password
                    appProfile.picture = 'default-profile.gif';

                } else if ( service == "linkedin" ) {
                    appProfile.email = user.services[service].emailAddress;                     
                    appProfile.firstName = user.services[service].firstName;                    
                    appProfile.lastName = user.services[service].lastName;                    
                    appProfile.picture = user.services[service].pictureUrl;                    

                } else {
                    console.log("Error. User created with unknown login service: " + service );
                    console.log("app-profile not created in Accounts.onCreateUser due to unknown login service: " + service);
                }

                user.appProfile = appProfile;

                return user;

            } else {

                // ##4

                existingUser = existingGitHubUser || existingGoogleUser || existingTwitterUser || existingFacebookUser || existingLinkedInUser;
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

        //
        // Copy across app-profile information to existing user if additional infomation is available from the new login service ##5
        //

        if ( service == "password") {
            // No additional information available from password

        } else if ( service == "facebook") {
            if ( !existingUser.appProfile.name || existingUser.appProfile.name.length <= 0 ) {
                existingUser.appProfile.name = user.services[service].name;                    
            }
            if ( !existingUser.appProfile.firstName || existingUser.appProfile.firstName.length <= 0 ) {
                existingUser.appProfile.firstName = user.services[service].first_name;                    
            }
            if ( !existingUser.appProfile.lastName || existingUser.appProfile.lastName.length <= 0 ) {
                existingUser.appProfile.lastName = user.services[service].last_name;                    
            }
            if ( !existingUser.appProfile.locale || existingUser.appProfile.locale.length <= 0 ) {
                existingUser.appProfile.locale = user.services[service].locale;                    
            }

        } else if ( service == "google") {

            if ( !existingUser.appProfile.name || existingUser.appProfile.name.length <= 0 ) {
                existingUser.appProfile.name = user.services[service].name;
            }
            if ( !existingUser.appProfile.firstName || existingUser.appProfile.firstName.length <= 0 ) {
                existingUser.appProfile.firstName = user.services[service].given_name;
            }
            if ( !existingUser.appProfile.lastName || existingUser.appProfile.lastName.length <= 0 ) {
                existingUser.appProfile.lastName = user.services[service].family_name;                    
            }
            if ( !existingUser.appProfile.locale || existingUser.appProfile.locale.length <= 0 ) {
                existingUser.appProfile.locale = user.services[service].locale;                    
            }
            if ( !existingUser.appProfile.picture || existingUser.appProfile.picture <= 0 || existingUser.appProfile.picture == 'default-profile.gif' ) {
                existingUser.appProfile.picture = user.services[service].picture;                    
            }

        } else if ( service == "githib") {
            // No additional information available from password

        } else if ( service == "linkedin") {
            if ( !existingUser.appProfile.firstName || existingUser.appProfile.firstName.length <= 0 ) {
                existingUser.appProfile.firstName = user.services[service].firstName;
            }
            if ( !existingUser.appProfile.lastName || existingUser.appProfile.lastName.length <= 0 ) {
                existingUser.appProfile.lastName = user.services[service].lastName;                    
            }
            if ( !existingUser.appProfile.picture || existingUser.appProfile.picture <= 0 || existingUser.appProfile.picture == 'default-profile.gif' ) {
                existingUser.appProfile.picture = user.services[service].pictureUrl;                    
            }


        } else {
            console.log("Error. User created with unknown login service: " + service );
            console.log("app-profile cound not be updated in Accounts.onCreateUser due to unknown login service: " + service);
        }

        Meteor.users.remove({_id: existingUser._id}); 	// remove existing record
        return existingUser;                  			// record is re-inserted
    }
});

