Messages = new Meteor.Collection('messages');
Channels = new Meteor.Collection('channels');

Meteor.publish("userStatus", function() {
  return Meteor.users.find();
});
