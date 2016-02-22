Messages = new Meteor.Collection('messages');
Channels = new Meteor.Collection('channels');

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
