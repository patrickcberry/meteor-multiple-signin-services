# meteor-multiple-signin-services

## The problem

When using multiple login providers (accounts-password, accounts-google, accounts-facebook etc.) in Meteor each services 
will create a seperate user in the Meteor.users collection even if the account is associated with the same email address.

## The solution

Implement code in the Accounts.onCreateUser function to,

* Determine the email address associated with the new account
* Determine if the email address is associated with an existing account
* If email exists, merge the two accounts
* Create a common user profile object (appProfile) to same data returned from login services using common naming

## Usage

### Packages

Include the following packages,
* accounts-base
* service-configuration
* accounts-ui
* accounts-password
* accounts-google
* accounts-facebook
* accounts-github
* twbs:bootstrap
* fortawesome:fontawesome

### Code

Include the following files in porject,
* main.js - Accounts.onCreateUser
* at_config.js - ServiceConfiguration.configurations

## Further Work

- [ ] Create a meteor package
- [ ] Integrate with INSPINIA template styles (is this needed as I am using bootstrap styling)
- [ ] Linking of appProfile data to service (auto update on login, update through edit form)

When part of a package include the following features,
- [ ] Form to edit application profile vales
- [ ] Form to link application profile values to login service - auto update on login
- [ ] Form to update profile values to login service - manual update

### Additional Login Services

Integrate the following login service providers,

- [ ] Microsoft
- [ ]  Linkedin
- [ ]  Twitter
- [ ]  Meetup
- [ ]  Instagram

## References

Based on example found here, http://stackoverflow.com/questions/15592965/how-to-add-external-service-logins-to-an-already-existing-account-in-meteor
