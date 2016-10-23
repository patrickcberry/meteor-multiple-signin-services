//
// Set up login services
//
Meteor.startup(function() {

    // Add Facebook configuration entry

    ServiceConfiguration.configurations.update(
      { "service": "facebook" },
      {
        $set: {
          "appId": "627804360722938",
          "secret": "af7f0089a461298ab59d4d9d4634c118"
        }
      },
      { upsert: true }
    );

    // Add Twitter configuration entry

    ServiceConfiguration.configurations.update(
      { "service": "twitter" },
      {
        $set: {
          "consumerKey": "yIVh0r0GBX2yamfShq4FMwkhc",
          "secret": "ghmefIjUgVenVxzScbVZEcdsh2YNkIg8tU2DPGUGdZIngrCb9d"
        }
      },
      { upsert: true }
    );

    // Add GitHub configuration entry
    
    ServiceConfiguration.configurations.update(
      { "service": "github" },
      {
        $set: {
          "clientId": "2e6abfcb3bbe0081a5e4",
          "secret": "2df0d05ac0d5c7575281905612a6009e3c41ad85"
        }
      },
      { upsert: true }
    );
    
    // Add Google configuration entry

    ServiceConfiguration.configurations.update(
      { "service": "google" },
      {
        $set: {
          "clientId": "23332176759-mvg9mot8apv0abrbs2derk6l1vriplhn.apps.googleusercontent.com",
          "secret": "VlAnupBsZaI2GX0MOBKgCsUM"
        }
      },
      { upsert: true }
    );

    // Add Meetup configuration entry

    ServiceConfiguration.configurations.update(
      { "service": "meetup" },
      {
        $set: {
          "clientId": "e835sd1v2esak05jucq9g8nkip",
          "secret": "tii8f2aplmo4k4vv7fo4lfdoee"
        }
      },
      { upsert: true }
    );

    ServiceConfiguration.configurations.update(
      { "service": "linkedin" },
      {
        $set: {
          "clientId": "786vffdsxf544o",
          "secret": "IzC07m1ggz4xAqgm"

          // Callback URL - same as application
        }
      },
      { upsert: true }
    );



    // Add Microsoft configuration entry
/**
    ServiceConfiguration.configurations.update(
      { "service": "microsoft" },
      {
        $set: {
          "clientId": "00000000481BD12C",
          "secret": "2qdjDqJorPWELzNDmYyLJZf"
        }
      },
      { upsert: true }
    );
*/
});