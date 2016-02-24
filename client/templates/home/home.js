Messages = new Meteor.Collection('messages');
Channels = new Meteor.Collection('channels');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template.index.events({
  "submit .search-emotion": function(event){
    event.preventDefault();
    var emotion = event.target.emotion.value;
    //*************//
    // TODO: Search for emotion from soundcloud api
    //*************//
    event.target.emotion.value = '';
  }
});
