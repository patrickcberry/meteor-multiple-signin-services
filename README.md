# meteor-multiple-signin-services

* TODO

- [ ] Clean up all code 
- [ ] Store profile info in a common application object attached to the Meteor.user object (email, name, locale)
- [ ] Display details of each login service 
- [ ] Remove keys files to private repository

----

# The problem

When using multiple login providers (accounts-password, accounts-google, accounts-facebook etc.) in Meteor each services 
will create a seperate user in the Meteor.users collection even if the account is associated with the same email address.

# The solution

Implement code in the Accounts.onCreateUser function to,

* Determine the email address associated with the new account
* Determine if the email address is associated with an existing account
* If email exists, merge the two accounts

# Usage

## Packages

Include the following packages,
* __TBC__

## Code

Include the following files in porject,
* __TBC__

# Further Work

## Additional Login Services

Integrate the following login service providers,

* Microsoft
* Linkedin
* Twitter
* Meetup
* Instagram

# References

Based on example found here, http://stackoverflow.com/questions/15592965/how-to-add-external-service-logins-to-an-already-existing-account-in-meteor
