Tracker.autorun(function(){
    Meteor.subscribe("chatrooms");
});

Template.chat.messages = function () {
  var messagesCursor = Messages.find({}, {sort:{timestamp:-1}, limit:42});
  var messages = messagesCursor.fetch().reverse(); // Should use observechnage to avoid over computation ?
  
  for (var i = messages.length - 1; i >= 0; i--) {
    var user =  Meteor.users.findOne(messages[i].author);
    if (user) {
      messages[i].name = user.profile.name;
    }
    else {
      messages[i].name = "Unknown";
    }
  }

  var conversations = [];
  var newConversation = messages[0];
  for (var i = 0; i <= messages.length - 2; i++) {
    var timedelta = messages[i+1].timestamp - messages[i].timestamp; 
    var sameauthor = (messages[i+1].author === messages[i].author);
    if (timedelta <= 30000 && sameauthor) {
      newConversation.message = newConversation.message + " \n" + messages[i+1].message;
    }
    else {
      conversations.push(newConversation);
      newConversation = messages[i+1];
    }
  };
  conversations.push(newConversation);
  // title bar alert 
  $.titleAlert("New chat message!", {requireBlur: true});
  return conversations;
};


Template.messages.helpers({
  'msgs':function(){
      var result=ChatRooms.findOne({_id:Session.get('roomid')});
      if(result){
        return result.messages;
      }
  }
});

Template.input.events ({
  'keydown input#message' : function (event) {
    
    if (event.which === 13) { 
        if (Meteor.user())
        {
          var name = Meteor.user().username;
          var message = document.getElementById('message');
          if (message.value !== '') {
            var de = ChatRooms.update({"_id":Session.get("roomid")},{$push:{messages:{
              name: name,
              text: message.value,
              createdAt: Date.now()
            }}});
            console.log(de);
            document.getElementById('message').value = '';
            message.value = '';
          }
        }
        else
        {
           alert("login to chat");
        } 
    }
  }
});
