Messages = new Meteor.Collection('messages');
Channels = new Meteor.Collection('channels');
ChatRooms = new Meteor.Collection("chatrooms");
Notifications = new Meteor.Collection('notifications');

Pairs = new Mongo.Collection("pairs");
Words = new Mongo.Collection("words");
Requests = new Mongo.Collection("requests");
Candidates = new Mongo.Collection("candidates");

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Meteor.startup(function(){
  SC.initialize({
    client_id: 'd3f2b79d4e0732d66a4cc3accf02dd92'
  });
  Session.set('current_song_url', 'https%3A//api.soundcloud.com/tracks/193532297');
});


Template.home.events({
  'submit .search-emotion': function(event){
    Router.go('/chat');
    event.preventDefault();
    var emotion = event.target.emotion.value;
    emotion = 'happy';
    
    event.target.emotion.value = '';
  }
});
