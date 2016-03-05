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
});


Template.home.events({
  'submit .search-emotion': function(event){
    Router.go('/chat');
    event.preventDefault();
    var emotion = event.target.emotion.value;
    SC.get('/tracks', {
      tag_list: emotion,
    }).then(function(tracks) {
      console.log(tracks);
    });
    event.target.emotion.value = '';
  }
});



/*
>>>>>>> 9a43422085be5a5c1f2ef019ea6ca48102ada669
Template.input_emotion.events ({
  'submit .next' : function (event, template) {
      //var emo = template.find("#emotion").value;
      event.preventDefault();
      Router.go('/chat');
  }
});
<<<<<<< HEAD
=======
*/


Meteor.startup(function(){
  SC.initialize({
    client_id: 'd3f2b79d4e0732d66a4cc3accf02dd92'
  });
  // find all sounds of buskers licensed under 'creative commons share alike'
  SC.get('/tracks', {
    q: 'buskers'
  }).then(function(tracks) {
    console.log(tracks);
  });

});




